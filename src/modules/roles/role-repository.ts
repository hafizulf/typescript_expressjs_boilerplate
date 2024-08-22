import { injectable } from "inversify";
import { IRoleRepository } from "./role-repository-interface";
import { Role as RoleDomain } from "./role-domain";
import { Role as RolePersistence } from "@/modules/common/sequelize";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { Pagination } from "../common/pagination";
import { Op } from "sequelize";

@injectable()
export class RoleRepository implements IRoleRepository {
  async findAll(): Promise<RoleDomain[]> {
    const role = await RolePersistence.findAll();
    return role.map((el) => RoleDomain.create(el.toJSON()));
  }
  async findAllWithPagination(
    paginateOption: TStandardPaginateOption,
    pagination: Pagination
  ): Promise<[RoleDomain[], Pagination]> {
    const search = paginateOption.search;
    const orderBy = paginateOption.orderBy ? paginateOption.orderBy : "name";
    const sort = paginateOption.sort ? paginateOption.sort : "DESC";
    const { rows, count } = await RolePersistence.findAndCountAll({
      where: {
        ...(search && {
          [Op.or]: [
            {
              name: {
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
    return [rows.map((el) => RoleDomain.create(el.toJSON())), pagination];
  }
}
