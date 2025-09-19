import { QueryInterface, QueryTypes } from "sequelize";
import { uuidv7 } from "uuidv7";

const UPDATED_BY = "seed:role_menu_permissions";
const SUPERADMIN_ROLE_ID = "018f47bc-1111-7777-b111-111111111111"; // must match Role seeder

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    const now = new Date();

    // Fetch all menu_permissions
    const menuPermissions = await queryInterface.sequelize.query<{
      id: string;
      menu_id: string;
      permission_id: string;
    }>(
      `
        SELECT id, menu_id, permission_id
        FROM menu_permissions
      `,
      { type: QueryTypes.SELECT, transaction: t }
    );

    for (const mp of menuPermissions) {
      // check if role_menu_permission already exists
      const [existing] = await queryInterface.sequelize.query<{ id: string }>(
        `
          SELECT id
          FROM role_menu_permissions
          WHERE role_id = :roleId
            AND menu_id = :menuId
            AND permission_id = :permissionId
          LIMIT 1
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            roleId: SUPERADMIN_ROLE_ID,
            menuId: mp.menu_id,
            permissionId: mp.permission_id,
          },
          transaction: t,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert(
          "role_menu_permissions",
          [
            {
              id: uuidv7(),
              role_id: SUPERADMIN_ROLE_ID,
              menu_id: mp.menu_id,
              permission_id: mp.permission_id,
              is_permitted: true,
              updated_by: UPDATED_BY,
              created_at: now,
              updated_at: now,
              deleted_at: null,
            },
          ],
          { transaction: t }
        );
      }
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
      "role_menu_permissions",
      { role_id: SUPERADMIN_ROLE_ID },
      { transaction: t }
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
