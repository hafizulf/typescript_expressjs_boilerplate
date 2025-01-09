import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute
} from "sequelize";
import { IMenuPermission } from "./menu-permission-domain";
import { uuidv7 } from "uuidv7";
import { sequelize } from "@/config/database";
import { Menu } from "../menus/menu-model";
import { Permission } from "../permissions/permission-model";

export class MenuPermission extends Model<
  InferAttributes<MenuPermission>,
  InferCreationAttributes<MenuPermission>
> implements IMenuPermission {
  declare id: CreationOptional<string>;
  declare menuId: string;
  declare permissionId: string;
  declare isEnabled: boolean;
  declare updatedBy: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare menu?: NonAttribute<Menu>;
  declare permission?: NonAttribute<Permission>;
  static associations: {
    menu: Association<MenuPermission, Menu>;
    permission: Association<MenuPermission, Permission>;
  }
}

MenuPermission.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv7(),
  },
  menuId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Menu,
      key: "id"
    }
  },
  permissionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Permission,
      key: "id"
    }
  },
  isEnabled: {
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
  tableName: "menu_permissions",
  modelName: "menuPermission",
  underscored: true,
  paranoid: true,
});
