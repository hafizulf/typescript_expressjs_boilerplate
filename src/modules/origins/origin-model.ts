import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IOrigin } from "./origin-domain";
import { uuidv7 } from "uuidv7";
import { sequelize } from "@/config/database";

export class Origin
  extends Model<InferAttributes<Origin>, InferCreationAttributes<Origin>>
  implements IOrigin
{
  declare id: CreationOptional<string>;
  declare origin: string;
  declare type: 'http' | 'ws';
  declare isBlocked: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Origin.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv7(),
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('http', 'ws'),
      allowNull: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "origins",
    modelName: "origin",
    underscored: true,
    paranoid: true,   
  }
);
