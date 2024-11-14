import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { IDashboardTotal } from "./dashboard-total-domain";
import { sequelize } from "@/config/database";
import { uuidv7 } from "uuidv7";

export class DashboardTotal extends Model <
  InferAttributes<DashboardTotal>,
  InferCreationAttributes<DashboardTotal>
> implements IDashboardTotal {
  declare id: CreationOptional<string>;
  declare name: string;
  declare totalCounted: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

DashboardTotal.init(
  {
    id: {
      type: "UUID",
      primaryKey: true,
      defaultValue: uuidv7(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalCounted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "dashboardTotal",
    tableName: "dashboard_totals",
    underscored: true,
    paranoid: true,
  }
)
