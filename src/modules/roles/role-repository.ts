import { injectable } from "inversify";
import { IRoleRepository } from "./role-repository-interface";
import { IRole, Role as RoleDomain } from "./role-domain";
import { Role as RolePersistence } from "@/modules/common/sequelize";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { Pagination } from "../common/pagination";
import { Op } from "sequelize";
import { AppError, HttpCode } from "@/exceptions/app-error";

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

  async store(props: IRole): Promise<RoleDomain> {
    const isExistRole = await RolePersistence.findOne({ where: { name: props.name } });
    if(isExistRole) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Role already exists",
      })
    }

    const createdRole = await RolePersistence.create(props);
    return RoleDomain.create(createdRole.toJSON());
  }

  async findById(id: string): Promise<RoleDomain> {
    const isExistRole = await RolePersistence.findByPk(id);
    if(!isExistRole) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role not found",
      })
    }

    return RoleDomain.create(isExistRole.toJSON());
  }

  async update(id: string, props: IRole): Promise<RoleDomain> {
    const isExistRole = await RolePersistence.findByPk(id);
    if(!isExistRole) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role not found",
      })
    }

    const isExistOtherRole = await RolePersistence.findOne({ where: { name: props.name } });
    if(isExistOtherRole && isExistOtherRole.id !== id) {
      throw new AppError({
        statusCode: HttpCode.CONFLICT,
        description: "Role already exists",
      })
    }

    const updatedRole = await isExistRole.update(props);
    return RoleDomain.create(updatedRole.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    const isExistRole = await RolePersistence.findByPk(id);
    if(!isExistRole) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role not found",
      })
    }

    await isExistRole.destroy();
    return true;
  }
}
