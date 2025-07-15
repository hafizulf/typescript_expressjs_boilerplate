import { injectable } from "inversify";
import { TStandardPaginateOption } from "@/modules/common/dto/pagination-dto";
import { Pagination } from "@/modules/common/pagination";
import { OriginType, TPropsCreateOrigin } from "./origin-dto";
import { IOriginRepository } from "./origin-repository-interface";
import { Origin, IOrigin } from "./origin-domain";
import { Origin as OriginPersistence } from "@/modules/common/sequelize";
import { Op } from "sequelize";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { OriginErrMessage } from "@/exceptions/error-message-constants";

@injectable()
export class OriginRepository implements IOriginRepository {
  findAll = async (): Promise<Origin[]> => {
    const data = await OriginPersistence.findAll({
      where: { isBlocked: false }
    });
    return data.map((el) => Origin.create(el.toJSON()));
  }
  findAllWithPagination = async (
    paginateOption: TStandardPaginateOption, 
    pagination: Pagination
  ): Promise<[Origin[], Pagination]> => {
    const search = paginateOption.search;
    const orderBy = paginateOption.orderBy ? paginateOption.orderBy : "type";
    const sort = paginateOption.sort ? paginateOption.sort : "DESC";
    const { rows, count } = await OriginPersistence.findAndCountAll({
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
        isBlocked: false,
      },
      order: [[orderBy, sort]],
      limit: pagination.limit,
      offset: pagination.offset,
    });

    pagination.generateMeta(count, rows.length);
    return [rows.map((el) => Origin.create(el.toJSON())), pagination];
  }
  store = async (props: TPropsCreateOrigin): Promise<Origin> => {
    const isExist = await OriginPersistence.findOne({
      where: {
        origin: props.origin
      }
    })
    if(isExist) {
      throw new AppError({
        statusCode: HttpCode.CONFLICT,
        description: OriginErrMessage.ALREADY_EXISTS,
      })
    }

    const created = await OriginPersistence.create(props);
    return Origin.create(created.toJSON());
  }
  findById = async (id: string): Promise<Origin> => {
    const data = await OriginPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: OriginErrMessage.NOT_FOUND,
      })
    }
    return Origin.create(data.toJSON());
  }
  update = async (id: string, props: IOrigin): Promise<Origin> => {
    const data = await OriginPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: OriginErrMessage.NOT_FOUND,
      })
    }
    const updated = await data.update(props);
    return Origin.create(updated.toJSON());
  }
  delete = async (id: string): Promise<boolean> => {
    const data = await OriginPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: OriginErrMessage.NOT_FOUND,
      })
    }
    await data.destroy();
    return true;
  }
  findAllByType = async (type: OriginType): Promise<Origin[]> => {
    const data = await OriginPersistence.findAll({
      where: {
        type,
        isBlocked: false,
      }
    });
    return data.map((el) => Origin.create(el.toJSON()));
  }
}
