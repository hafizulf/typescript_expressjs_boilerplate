import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("menus", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "menus", // self-reference
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  // Index for tree navigation (common)
  await queryInterface.addIndex("menus", ["parent_id"], {
    name: "idx_menus_parent_id",
  });

  // Partial index: only track inactive menus (rare case)
  await queryInterface.sequelize.query(`
    CREATE INDEX idx_menus_inactive
    ON menus(is_active)
    WHERE is_active = false;
  `);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("menus");
}
