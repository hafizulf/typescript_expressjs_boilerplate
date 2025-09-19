import { QueryInterface } from "sequelize";
import { uuidv7 } from "uuidv7";

const UPDATED_BY = "seed:menu";

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    const now = new Date();
    const accessMgmtId = uuidv7();
    const rows = [
      {
        id: accessMgmtId,
        name: "User Access Management",
        path: "/user-access-management",
        icon: "shield",
        parent_id: null,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "Role",
        path: "/role",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "User",
        path: "/user",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "Menu",
        path: "/menu",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "Permission",
        path: "/permission",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "Menu Permission",
        path: "/menu-permission",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "Role Menu Permission",
        path: "/role-menu-permission",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "Master Data",
        path: "/master-data",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: uuidv7(),
        name: "Refresh Token",
        path: "/refresh-token",
        icon: null,
        parent_id: accessMgmtId,
        is_active: true,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ];

    await queryInterface.bulkInsert("menus", rows, { transaction: t });
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
