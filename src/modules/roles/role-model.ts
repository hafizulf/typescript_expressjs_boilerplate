import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IRole } from "./role-domain";
import { uuidv7 } from "uuidv7";
import { sequelize } from "@/config/database";
import { User } from "../users/user-model";

export class Role
  extends Model<InferAttributes<Role>, InferCreationAttributes<Role>>
  implements IRole
{
  declare id: CreationOptional<string>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare static associations: {
    users: Association<Role, User>;
  }
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv7(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "roles",
    modelName: "role",
    underscored: true,
    paranoid: true,
  }
);
