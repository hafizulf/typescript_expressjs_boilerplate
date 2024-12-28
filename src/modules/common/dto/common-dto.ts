import { Transaction } from "sequelize";

export interface DefaultEntityBehaviour<I> {
  unmarshal(): I;
}

export interface BaseQueryOption {
  transaction: Transaction;
}
