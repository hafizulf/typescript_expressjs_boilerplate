import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { IRefreshToken } from "./refresh-token-domain";
import { sequelize } from "@/config/database";

export class RefreshToken extends Model
  <InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>>
implements IRefreshToken {
  declare userId: string;
  declare token: string;
  declare createdAt: Date;
  declare updatedAt: CreationOptional<Date>;
}

RefreshToken.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
  }
}, {
  sequelize,
  modelName: "refreshToken",
  tableName: "refresh_tokens",
  underscored: true,
  timestamps: false,
  indexes: [
    { fields: ["user_id"] },
  ]
})
