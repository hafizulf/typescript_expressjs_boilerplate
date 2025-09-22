import { QueryInterface, QueryTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { uuidv7 } from "uuidv7";

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    const now = new Date();

    // Configure via env in real deployments;
    // fallback values are fine for local/dev.
    const ROLE_NAME = "superadmin";
    const SUPERADMIN_EMAIL =
      process.env.SUPERADMIN_EMAIL ?? "superadmin@example.com";
    const SUPERADMIN_NAME = process.env.SUPERADMIN_NAME ?? "Super Admin";
    const RAW_PASSWORD =
      process.env.SUPERADMIN_PASSWORD ?? "superadmin123";
    const password = await bcrypt.hash(RAW_PASSWORD, 10);

    // 1) Upsert Role by unique name, returning its id (idempotent)
    const [roleRow] = await queryInterface.sequelize.query<{ id: string }>(
      `
      WITH ins AS (
        INSERT INTO roles (id, name, created_at, updated_at, deleted_at)
        VALUES (:id, :name, :now, :now, NULL)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      )
      SELECT id FROM ins
      UNION ALL
      SELECT id FROM roles WHERE name = :name
      LIMIT 1
    `,
      {
        type: QueryTypes.SELECT,
        replacements: { id: uuidv7(), name: ROLE_NAME, now },
        transaction: t,
      }
    );
    if (!roleRow?.id) throw new Error("Failed to obtain superadmin role id");
    const roleId = roleRow.id;

    // 2) Upsert User by unique email, returning its id (idempotent)
    const [userRow] = await queryInterface.sequelize.query<{ id: string }>(
      `
      WITH ins AS (
        INSERT INTO users (
          id, full_name, email, password, avatar_path,
          role_id, token_version, updated_by, created_at, updated_at, deleted_at
        )
        VALUES (
          :id, :full_name, :email, :password, '',
          :role_id, 0, :updated_by, :now, :now, NULL
        )
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      )
      SELECT id FROM ins
      UNION ALL
      SELECT id FROM users WHERE email = :email
      LIMIT 1
    `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: uuidv7(),
          full_name: SUPERADMIN_NAME,
          email: SUPERADMIN_EMAIL,
          password,
          role_id: roleId,
          updated_by: "seed:bootstrap",
          now,
        },
        transaction: t,
      }
    );
    if (!userRow?.id) throw new Error("Failed to obtain superadmin user id");

    // 3) Grant all menu_permissions to the superadmin role (idempotent)
    //    Insert ONLY the missing (role_id, menu_id, permission_id) pairs.
    type Pair = { menu_id: string; permission_id: string };

    const missing: Pair[] = await queryInterface.sequelize.query<Pair>(
      `
      SELECT mp.menu_id, mp.permission_id
      FROM menu_permissions mp
      WHERE NOT EXISTS (
        SELECT 1
        FROM role_menu_permissions rmp
        WHERE rmp.role_id = :roleId
          AND rmp.menu_id = mp.menu_id
          AND rmp.permission_id = mp.permission_id
      )
      `,
      { type: QueryTypes.SELECT, replacements: { roleId }, transaction: t }
    );

    // now p is a Pair, so these exist:
    await queryInterface.bulkInsert(
      "role_menu_permissions",
      missing.map((p) => ({
        id: uuidv7(),
        role_id: roleId,
        menu_id: p.menu_id,
        permission_id: p.permission_id,
        is_permitted: true,
        updated_by: "seed:bootstrap",
        created_at: now,
        updated_at: now,
        deleted_at: null,
      })),
      { transaction: t }
    );

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function down(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    const ROLE_NAME = "superadmin";
    const SUPERADMIN_EMAIL =
      process.env.SUPERADMIN_EMAIL ?? "superadmin@example.com";

    const [role] = await queryInterface.sequelize.query<{ id: string }>(
      `SELECT id FROM roles WHERE name = :name LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: { name: ROLE_NAME },
        transaction: t,
      }
    );

    if (role?.id) {
      await queryInterface.bulkDelete(
        "role_menu_permissions",
        { role_id: role.id },
        { transaction: t }
      );
    }

    await queryInterface.bulkDelete(
      "users",
      { email: SUPERADMIN_EMAIL },
      { transaction: t }
    );

    await queryInterface.bulkDelete(
      "roles",
      { name: ROLE_NAME },
      { transaction: t }
    );

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
