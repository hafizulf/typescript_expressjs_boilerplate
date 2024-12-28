import { BaseQueryOption } from "../common/dto/common-dto";
import { injectable } from "inversify";
import { IUserLogs, UserLogsDomain } from "./user-logs-domain";
import { IUserLogsRepository } from "./user-logs-repository-interface";
import { Pagination } from "../common/pagination";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { UserLogs as UserLogsPersistence } from "@/modules/common/sequelize";
import { Op } from "sequelize";
import { AppError, HttpCode } from "@/exceptions/app-error";

@injectable()
export class UserLogsRepository implements IUserLogsRepository {
  async store(
    props: IUserLogs,
    option: BaseQueryOption
  ): Promise<UserLogsDomain> {
    const data = await UserLogsPersistence.create(props, { transaction: option.transaction });
    return UserLogsDomain.create(data.toJSON());
  }

  async findAllWithPagination(
    paginateOption: TStandardPaginateOption,
    pagination: Pagination
  ): Promise<[UserLogsDomain[], Pagination]> {
    const search = paginateOption.search;
    const orderBy = paginateOption.orderBy ? paginateOption.orderBy : "description";
    const sort = paginateOption.sort ? paginateOption.sort : "DESC";

    const { rows, count } = await UserLogsPersistence.findAndCountAll({
      where: {
        ...(search && {
          [Op.or]: [
            {
              description: {
                [Op.iLike]: `%${search}%`,
              },
            },
          ],
        }),
      },
      order: [[orderBy, sort]],
      limit: pagination.limit,
      offset: pagination.offset,
    });

    pagination.generateMeta(count, rows.length);
    return [rows.map((el) => UserLogsDomain.create(el.toJSON())), pagination];
  }

  async findById(id: string): Promise<UserLogsDomain> {
    const data = await UserLogsPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User logs not found",
      })
    }
    return UserLogsDomain.create(data.toJSON());
  }

  async getOldestUserLogs(): Promise<UserLogsDomain | null> {
    const data = await UserLogsPersistence.findOne({
      order: [["createdAt", "ASC"]],
    });

    return data ? UserLogsDomain.create(data.toJSON()) : null;
  }

  async deleteUserLogsBefore(date: Date): Promise<void> {
    await UserLogsPersistence.destroy({
      where: {
        createdAt: { [Op.lt]: date }  // Keep logs from the last 7 days
      }
    });
  }
}
