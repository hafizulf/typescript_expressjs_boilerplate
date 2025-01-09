import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";
import { IPermission } from "./permission-domain";
import { sequelize } from "@/config/database";
import { uuidv7 } from "uuidv7";

export class Permission extends Model <
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> implements IPermission {
  declare id: CreationOptional<string>;
  declare name: string;
  declare updatedBy: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Permission.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv7(),
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "permissions",
  modelName: "permission",
  underscored: true,
  paranoid: true,
});
