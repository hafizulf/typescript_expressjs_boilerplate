import { QueryInterface, QueryTypes } from "sequelize";
import { uuidv7 } from "uuidv7";

const UPDATED_BY = "seed:menu";

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    // define menus once, with deterministic paths/names
    const now = new Date();
    const accessMgmtId = uuidv7();
    const MENUS = [
      {
        id: accessMgmtId,
        name: "User Access Management",
        path: "/user-access-management",
        icon: "",
        parent_id: null,
      },
      { name: "Role", path: "/role", parent_id: accessMgmtId },
      { name: "User", path: "/user", parent_id: accessMgmtId },
      { name: "Menu", path: "/menu", parent_id: accessMgmtId },
      { name: "Permission", path: "/permission", parent_id: accessMgmtId },
      { name: "Menu Permission", path: "/menu-permission", parent_id: accessMgmtId },
      { name: "Role Menu Permission", path: "/role-menu-permission", parent_id: accessMgmtId },
      { name: "Master Data", path: "/master-data" },
      { name: "Refresh Token", path: "/refresh-token" },
    ];

    // get existing menu paths to avoid duplicates
    const existing = await queryInterface.sequelize.query<{ path: string }>(
      `SELECT path FROM menus WHERE path IN (:paths)`,
      {
        type: QueryTypes.SELECT,
        transaction: t,
        replacements: { paths: MENUS.map(m => m.path) },
      }
    );

    const existingPaths = new Set(existing.map(r => r.path));

    const rowsToInsert = MENUS.filter(m => !existingPaths.has(m.path)).map(m => ({
      id: m.id ?? uuidv7(),
      name: m.name,
      path: m.path,
      icon: m.icon ?? null,
      parent_id: m.parent_id ?? null,
      is_active: true,
      updated_by: UPDATED_BY,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }));

    if (rowsToInsert.length > 0) {
      await queryInterface.bulkInsert("menus", rowsToInsert, { transaction: t });
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
      "menus",
      { updated_by: UPDATED_BY },
      { transaction: t }
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
