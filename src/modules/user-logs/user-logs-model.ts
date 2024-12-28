import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { IUserLogs } from "./user-logs-domain";
import { sequelize } from "@/config/database";
import { uuidv7 } from "uuidv7";

export class UserLogs extends Model <
  InferAttributes<UserLogs>,
  InferCreationAttributes<UserLogs>
> implements IUserLogs {
  declare id: CreationOptional<string>;
  declare description: string;
  declare createdBy: string;
  declare createdAt: CreationOptional<Date>;
}

UserLogs.init({
  id: {
    type: "UUID",
    primaryKey: true,
    defaultValue: () => uuidv7(),
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  }
}, {
  modelName: "userLogs",
  tableName: "user_logs",
  sequelize,
  underscored: true,
  paranoid: true,
  timestamps: true,
  updatedAt: false,
  deletedAt: false,
})
