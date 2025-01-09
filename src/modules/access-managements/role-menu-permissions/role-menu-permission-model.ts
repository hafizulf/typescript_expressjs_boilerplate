import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute
} from "sequelize";
import { IRoleMenuPermission } from "./role-menu-permission-domain";
import { Role } from "@/modules/roles/role-model";
import { Menu } from "../menus/menu-model";
import { Permission } from "../permissions/permission-model";
import { sequelize } from "@/config/database";
import { uuidv7 } from "uuidv7";

export class RoleMenuPermission extends Model <
  InferAttributes<RoleMenuPermission>,
  InferCreationAttributes<RoleMenuPermission>
> implements IRoleMenuPermission {
  declare id: CreationOptional<string>;
  declare roleId: string;
  declare menuId: string;
  declare permissionId: string;
  declare isPermitted: boolean;
  declare updatedBy: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare role?: NonAttribute<Role>;
  declare menu?: NonAttribute<Menu>;
  declare permission?: NonAttribute<Permission>;
  static associations: {
    role: Association<RoleMenuPermission, Role>;
    menu: Association<RoleMenuPermission, Menu>;
    permission: Association<RoleMenuPermission, Permission>;
  };
}

RoleMenuPermission.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv7()
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Role,
      key: "id"
    }
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
  isPermitted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE
}, {
  sequelize,
  tableName: "role_menu_permissions",
  modelName: "roleMenuPermission",
  underscored: true,
  paranoid: true
})
