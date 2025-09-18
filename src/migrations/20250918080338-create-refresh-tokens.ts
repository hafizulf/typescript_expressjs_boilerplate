import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("refresh_tokens", {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
  });

  await queryInterface.addIndex("refresh_tokens", ["user_id"], {
    name: "idx_refresh_tokens_user_id",
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("refresh_tokens");
}
