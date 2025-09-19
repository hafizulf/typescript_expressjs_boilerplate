import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("dashboard_totals", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    total_counted: {
      type: DataTypes.INTEGER,
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

  await queryInterface.addIndex("dashboard_totals", ["name"], {
    name: "idx_dashboard_totals_name",
  });

  await queryInterface.addIndex("dashboard_totals", ["deleted_at"], {
    name: "idx_dashboard_totals_deleted_at",
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("dashboard_totals");
}
