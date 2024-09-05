import { injectable } from "inversify";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { Pagination } from "../common/pagination";
import { UserDomain, IUser } from "./user-domain";
import { IUserRepository } from "./user-repository-interface";
import { User as UserPersistence } from "./user-model";
import { Role as RolePersistence } from "../roles/role-model";
import { Op, Sequelize } from "sequelize";

@injectable()
export class UserRepository implements IUserRepository {
  async findAll(): Promise<UserDomain[]> {
    const users = await UserPersistence.findAll();
    return users.map((el) => UserDomain.create(el.toJSON()));
  }

  async findAllWithPagination(
    paginateOption: TStandardPaginateOption,
    pagination: Pagination
  ): Promise<[UserDomain[], Pagination]> {
    const search = paginateOption.search;
    const orderBy = paginateOption.orderBy ? paginateOption.orderBy : "fullName";
    const sort = paginateOption.sort ? paginateOption.sort : "DESC";
    const searchCondition = search
      ? {
          [Op.or]: [
            {
              fullName: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${search}%`,
              },
            },
            Sequelize.literal(`"role"."name" ILIKE :search`),
          ],
        }
      : {};

    const { rows, count } = await UserPersistence.findAndCountAll({
      include: [
        {
          model: RolePersistence,
          attributes: ["name"],
        }
      ],
      where: {
        ...searchCondition,
      },
      replacements: { search: `%${search}%` },
      order: [
        orderBy === "role"
          ? [Sequelize.col("role.name"), sort]
          : [Sequelize.col(orderBy), sort],
      ],
      limit: pagination.limit,
      offset: pagination.offset,
    });

    pagination.generateMeta(count, rows.length);
    return [rows.map((el) => UserDomain.create(el.toJSON())), pagination];
  }
  store(props: IUser): Promise<UserDomain> {
    throw new Error("Method not implemented.", { cause: props });
  }
  findById(id: string): Promise<UserDomain> {
    throw new Error("Method not implemented.", { cause: id });
  }
  update(id: string, props: IUser): Promise<UserDomain> {
    throw new Error("Method not implemented.", { cause: {id, props} });
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.", { cause: id });
  }

}
