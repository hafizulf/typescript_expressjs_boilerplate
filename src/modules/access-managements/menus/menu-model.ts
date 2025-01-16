import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";
import { IMenu } from "./menu-domain";
import { uuidv7 } from "uuidv7";
import { sequelize } from "@/config/database";

export class Menu extends Model<
  InferAttributes<Menu>,
  InferCreationAttributes<Menu>
> implements IMenu {
  declare id: CreationOptional<string>;
  declare name: string;
  declare path: string;
  declare icon: CreationOptional<string | null>;
  declare parentId: CreationOptional<string | null>;
  declare isActive: boolean;
  declare updatedBy: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Menu.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv7(),
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: DataTypes.STRING,
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Menu,
      key: "id"
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: "menus",
  modelName: "menu",
  underscored: true,
  paranoid: true,
})
