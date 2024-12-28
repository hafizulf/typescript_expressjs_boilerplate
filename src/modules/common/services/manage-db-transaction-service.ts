import { injectable } from "inversify";
import { sequelize } from "@/config/database";
import { Transaction } from "sequelize";
import { AppError, HttpCode } from "@/exceptions/app-error";

@injectable()
export class ManageDbTransactionService {
  public async handle<T>(
    callback: (transaction: Transaction) => Promise<T>,
    errorMessage: string,
    optionalCallback?: {
      onSuccess?: () => void, // Additional actions (e.g., sending notifications)
      onFailed?: () => void, // Cleaning up resources or reverting temporary changes (e.g., deleting temporary files) etc
      onDone?: () => void, // All these 3 cb g good for monitoring
    }
  ): Promise<T> {
    const transaction = await sequelize.transaction();

    try {
      const result = await callback(transaction);
      await transaction.commit();

      if(optionalCallback && optionalCallback.onSuccess) {
        optionalCallback.onSuccess();
      }

      return result;
    } catch (error) {
      console.error(error);
      await transaction.rollback();

      if(optionalCallback && optionalCallback.onFailed) {
        optionalCallback.onFailed();
      }

      if(error instanceof Error) {
        throw error;
      }

      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: errorMessage,
      });
    } finally {
      if(optionalCallback && optionalCallback.onDone) {
        optionalCallback.onDone();
      }
    }
  }
}
