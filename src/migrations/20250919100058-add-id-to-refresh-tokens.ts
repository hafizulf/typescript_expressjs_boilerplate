import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn("refresh_tokens", "id", {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn("refresh_tokens", "id");
}
