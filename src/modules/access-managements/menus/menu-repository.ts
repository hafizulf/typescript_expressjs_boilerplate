import { AppError, HttpCode } from "@/exceptions/app-error";
import { injectable } from "inversify";
import { IMenuRepository } from "./menu-repository-interface";
import { MenuDomain, IMenu } from "./menu-domain";
import { Menu as MenuPersistence } from "@/modules/common/sequelize";
import { MenuErrMessage } from "@/exceptions/error-message-constants";

@injectable()
export class MenuRepository implements IMenuRepository {
  async findAll(): Promise<MenuDomain[]> {
    const data = await MenuPersistence.findAll();
    return data.map((el) => MenuDomain.create(el.toJSON()));
  }

  async findAllParents(): Promise<MenuDomain[]> {
    const data = await MenuPersistence.findAll({ where: { parentId: null } });
    return data.map((el) => MenuDomain.create(el.toJSON()));
  }

  async findChildsByParentId(parentId: string): Promise<MenuDomain[]> {
    const data = await MenuPersistence.findAll({ where: { parentId } });
    return data.map((el) => MenuDomain.create(el.toJSON()));
  }

  async store(props: IMenu): Promise<MenuDomain> {
    const data = await MenuPersistence.findOne({ where: { name: props.name } });
    if(data) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: MenuErrMessage.ALREADY_EXISTS,
      })
    }

    const createdMenu = await MenuPersistence.create(props);
    return MenuDomain.create(createdMenu.toJSON());
  }

  async findById(id: string): Promise<MenuDomain> {
    const data = await MenuPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: MenuErrMessage.NOT_FOUND,
      })
    }
    return MenuDomain.create(data.toJSON());
  }

  async update(id: string, props: IMenu): Promise<MenuDomain> {
    const data = await MenuPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: MenuErrMessage.NOT_FOUND,
      })
    }

    const nameIsExists = await MenuPersistence.findOne({ where: { name: props.name } });
    if(nameIsExists && nameIsExists.id !== id) {
      throw new AppError({
        statusCode: HttpCode.CONFLICT,
        description: MenuErrMessage.ALREADY_EXISTS,
      })
    }

    const pathIsExists = await MenuPersistence.findOne({ where: { path: props.path } });
    if(pathIsExists && pathIsExists.id !== id) {
      throw new AppError({
        statusCode: HttpCode.CONFLICT,
        description: "Menu path already exist",
      })
    }

    const updatedMenu = await data.update(props);
    return MenuDomain.create(updatedMenu.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    const data = await MenuPersistence.findByPk(id);
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: MenuErrMessage.NOT_FOUND,
      })
    }

    await data.destroy();
    return true;
  }
}
