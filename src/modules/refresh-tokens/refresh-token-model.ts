import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { IRefreshToken } from "./refresh-token-domain";
import { sequelize } from "@/config/database";

export class RefreshToken extends Model
  <InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>>
implements IRefreshToken {
  declare userId: string;
  declare token: string;
  declare createdAt: Date;
}

RefreshToken.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: "refreshToken",
  tableName: "refresh_tokens",
  paranoid: true,
  underscored: true,
  timestamps: false,
})
