import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";
import { IUser } from "./user-domain";
import { Role } from "../roles/role-model";
import { uuidv7 } from "uuidv7";
import { sequelize } from "@/config/database";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> implements IUser {
  declare id: CreationOptional<string>;
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare avatarPath: CreationOptional<string>;
  declare roleId: string;
  declare tokenVersion: CreationOptional<number>;
  declare updatedBy: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare static associations: {
    role: Association<User, Role>;
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv7(),
  },
  fullName: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true, // Unique constraint will automatically create an index
  },
  password: DataTypes.STRING,
  avatarPath: {
    defaultValue: "",
    type: DataTypes.STRING,
  },
  roleId: {
    type: DataTypes.UUID,
    references: {
      model: Role,
      key: "id"
    },
    allowNull: false
  },
  tokenVersion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  updatedBy: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "users",
  modelName: "user",
  underscored: true,
  paranoid: true,
  indexes: [
    { fields: ['full_name'] }, // Non-unique index for searching by full name
    { fields: ['role_id'] }, // Non-unique index for joining roles
    { fields: ['deleted_at'] }, // Optimize `paranoid` queries
  ],
})
