import { AppError, HttpCode } from "@/exceptions/app-error";
import { injectable } from "inversify";
import { IPermissionRepository } from "./permission-repository-interface";
import { PermissionDomain, IPermission } from "./permission-domain";
import { Permission as PermissionPersistence } from "@/modules/common/sequelize";
import { PermissionErrMessage } from "@/exceptions/error-message-constants";

@injectable()
export class PermissionRepository implements IPermissionRepository {
  async findAll(): Promise<PermissionDomain[]> {
    const data = await PermissionPersistence.findAll({ order: [["createdAt", "ASC"]] });
    return data.map((el) => PermissionDomain.create(el.toJSON()));
  }

  async store(props: IPermission): Promise<PermissionDomain> {
    const data = await PermissionPersistence.findOne({ where: { name: props.name } });
    if(data) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: PermissionErrMessage.ALREADY_EXISTS,
      })
    }

    const createdPermission = await PermissionPersistence.create(props);
    return PermissionDomain.create(createdPermission.toJSON());
  }

  async findById(id: string): Promise<PermissionDomain> {
    const data = await PermissionPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: PermissionErrMessage.NOT_FOUND,
      })
    }
    return PermissionDomain.create(data.toJSON());
  }

  async update(id: string, props: IPermission): Promise<PermissionDomain> {
    const data = await PermissionPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: PermissionErrMessage.NOT_FOUND,
      })
    }

    const nameIsExists = await PermissionPersistence.findOne({ where: { name: props.name } });
    if(nameIsExists && nameIsExists.id !== id) {
      throw new AppError({
        statusCode: HttpCode.CONFLICT,
        description: PermissionErrMessage.ALREADY_EXISTS,
      })
    }

    const updatedPermission = await data.update(props);
    return PermissionDomain.create(updatedPermission.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    const data = await PermissionPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: PermissionErrMessage.NOT_FOUND,
      })
    }

    await data.destroy();
    return true;
  }
}
