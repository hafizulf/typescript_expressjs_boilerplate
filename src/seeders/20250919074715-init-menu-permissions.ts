import { QueryInterface, QueryTypes } from "sequelize";
import { uuidv7 } from "uuidv7";

const UPDATED_BY = "seed:menu-permission";

const ENABLED_MENU: Record<string, string[]> = {
  ROLE: ["READ", "CREATE", "UPDATE", "DELETE"],
  USER: ["READ", "CREATE", "UPDATE", "DELETE"],
  MENU: ["READ", "CREATE", "UPDATE", "DELETE"],
  PERMISSION: ["READ", "CREATE", "UPDATE", "DELETE"],
  MENU_PERMISSION: ["READ", "CREATE", "UPDATE", "DELETE", "BULK UPDATE"],
  ROLE_MENU_PERMISSION: ["READ", "CREATE", "UPDATE", "BULK UPDATE"],
};

function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    // 1. Get all child menus
    const menus = await queryInterface.sequelize.query<{ id: string; name: string }>(
      `SELECT id, name FROM menus WHERE parent_id IS NOT NULL ORDER BY created_at ASC`,
      { type: QueryTypes.SELECT, transaction: t }
    );

    // 2. Get all permissions
    const permissions = await queryInterface.sequelize.query<{ id: string; name: string }>(
      `SELECT id, name FROM permissions ORDER BY created_at ASC`,
      { type: QueryTypes.SELECT, transaction: t }
    );

    const now = new Date();
    const rowsToInsert: any[] = [];
    const updates: { menu_id: string; permission_id: string }[] = [];

    for (const menu of menus) {
      const key = toSnakeCase(menu.name).toUpperCase();
      const enabledSet = new Set(ENABLED_MENU[key] ?? []);

      for (const permission of permissions) {
        // Does this pair already exist?
        const existing = await queryInterface.sequelize.query<{ id: string; is_enabled: boolean }>(
          `SELECT id, is_enabled
           FROM menu_permissions
           WHERE menu_id = :menuId AND permission_id = :permissionId
           LIMIT 1`,
          {
            type: QueryTypes.SELECT,
            transaction: t,
            replacements: { menuId: menu.id, permissionId: permission.id },
          }
        );

        if (existing.length === 0) {
          // Not exists, insert default
          rowsToInsert.push({
            id: uuidv7(),
            menu_id: menu.id,
            permission_id: permission.id,
            is_enabled: enabledSet.has(permission.name), // enable if in ENABLED_MENU
            updated_by: UPDATED_BY,
            created_at: now,
            updated_at: null,
            deleted_at: null,
          });
        } else {
          // Exists, update if needed
          const row = existing[0]!;
          if (!row.is_enabled && enabledSet.has(permission.name)) {
            updates.push({ menu_id: menu.id, permission_id: permission.id });
          }
        }
      }
    }

    // bulk insert missing
    if (rowsToInsert.length > 0) {
      await queryInterface.bulkInsert("menu_permissions", rowsToInsert, { transaction: t });
    }

    // update existing to enabled
    for (const upd of updates) {
      await queryInterface.sequelize.query(
        `
          UPDATE menu_permissions
          SET is_enabled = TRUE, updated_by = :updatedBy, updated_at = :now
          WHERE menu_id = :menuId AND permission_id = :permissionId
        `,
        {
          transaction: t,
          replacements: {
            menuId: upd.menu_id,
            permissionId: upd.permission_id,
            updatedBy: UPDATED_BY,
            now,
          },
        }
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
      "menu_permissions",
      { updated_by: UPDATED_BY },
      { transaction: t }
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
