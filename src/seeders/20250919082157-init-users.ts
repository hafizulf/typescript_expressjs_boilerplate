import { QueryInterface } from "sequelize";
import bcrypt from "bcryptjs";

const UPDATED_BY = "seed:user";
const SUPERADMIN_ROLE_ID = "018f47bc-1111-7777-b111-111111111111"; // from role seeder
const SUPERADMIN_USER_ID = "018f47bc-2222-7777-b222-222222222222"; // fixed UUID v7 style

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    const now = new Date();
    const password = await bcrypt.hash("superadmin123", 10);
    const [results] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE id = :id OR email = :email`,
      {
        replacements: { id: SUPERADMIN_USER_ID, email: "superadmin@example.com" },
        transaction: t,
      }
    );

    if ((results as any[]).length === 0) {
      await queryInterface.bulkInsert(
        "users",
        [
          {
            id: SUPERADMIN_USER_ID,
            full_name: "Super Admin",
            email: "superadmin@example.com",
            password,
            avatar_path: "",
            role_id: SUPERADMIN_ROLE_ID,
            token_version: 0,
            updated_by: UPDATED_BY,
            created_at: now,
            updated_at: now,
            deleted_at: null,
          },
        ],
        { transaction: t }
      );
    }

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function down(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.bulkDelete(
      "users",
      { id: SUPERADMIN_USER_ID },
      { transaction: t }
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
