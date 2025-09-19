import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("menu_permissions", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    menu_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "menus",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    is_enabled: {
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

  // Optionally enforce uniqueness (prevent duplicate menu-permission pairs)
  await queryInterface.addConstraint("menu_permissions", {
    fields: ["menu_id", "permission_id"],
    type: "unique",
    name: "uniq_menu_permission_pair",
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("menu_permissions");
}
