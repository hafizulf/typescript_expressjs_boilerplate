import { ENABLED_MENU } from "../menus/dto/enabled-menu";
import { IMenuPermission, MenuPermissionDomain } from "./menu-permission-domain";
import { IMenuPermissionRepository } from "./menu-permission-repository-interface";
import { injectable } from "inversify";
import { ListPermissionsByMenu } from "./menu-permission-dto";
import { Menu as MenuPersistence } from "@/modules/common/sequelize";
import { MenuPermission as MenuPermissionPersistence } from "@/modules/common/sequelize";
import { Op } from "sequelize";
import { Permission as PermissionPersistence } from "@/modules/common/sequelize";
import { toSnakeCase } from "@/libs/formatters";
import { AppError, HttpCode } from "@/exceptions/app-error";

@injectable()
export class MenuPermissionRepository implements IMenuPermissionRepository {
  async findAll(): Promise<MenuPermissionDomain[]> {
    const data = await MenuPermissionPersistence.findAll();
    return data.map((el) => MenuPermissionDomain.create(el.toJSON()));
  }

  async findAllGroupByMenus(): Promise<ListPermissionsByMenu[]> {
    const data = await MenuPermissionPersistence.findAll({
      attributes: ["menuId", "permissionId", "isEnabled"],
      include: [
        {
          model: MenuPersistence,
          attributes: ["name"],
        },
        {
          model: PermissionPersistence,
          attributes: ["name"],
        },
      ],
    });

    let result: ListPermissionsByMenu[] = [];
    for(const item of data) {
      const menu = result.find((el) => el.menuId === item.menuId);
      if(menu) {
        menu.permissionList.push({
          permissionId: item.permissionId,
          permission: item.permission?.name!,
          isEnabled: item.isEnabled,
        });
      } else {
        result.push({
          menuId: item.menuId,
          menu: item.menu?.name!,
          permissionList: [
            {
              permissionId: item.permissionId,
              permission: item.permission?.name!,
              isEnabled: item.isEnabled,
            },
          ],
        });
      }
    }

    return result;
  }

  async store(props: IMenuPermission): Promise<MenuPermissionDomain> {
    try {
      const isExist = await MenuPermissionPersistence.findOne({
        where: {
          menuId: props.menuId,
          permissionId: props.permissionId,
        },
      });

      if (isExist) {
        throw new AppError({
          statusCode: HttpCode.CONFLICT,
          description: "Menu permission already exists",
        });
      }

      await MenuPermissionPersistence.create(props);
    } catch (e: Error | any) {
      if (e.name === 'SequelizeForeignKeyConstraintError') {
        throw new AppError({
          statusCode: HttpCode.BAD_REQUEST,
          description: 'Menu or permission does not exist',
        });
      }

      if (e instanceof AppError) {
        throw e;
      }

      console.error('Unexpected error:', e);
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: 'An unexpected error occurred',
      });
    }

    return MenuPermissionDomain.create(props);
  }

  async seedMenuPermission(updatedBy: string): Promise<void> {
    const menus = await MenuPersistence.findAll({
      where: {
        parentId: {
          [Op.ne]: null,
        }
      },
      order: [['createdAt', 'ASC']]
    })
    const permissions = await PermissionPersistence.findAll({ order: [['createdAt', 'ASC']] });

    for(const menu of menus) {
      for(const permission of permissions) {
        const [row] = await MenuPermissionPersistence.findOrCreate({
          where: {
            menuId: menu.id,
            permissionId: permission.id,
          },
          defaults: {
            menuId: menu.id,
            permissionId: permission.id,
            isEnabled: false,
            updatedBy,
          }
        })

        // Enabling default permissions
        for(const key in ENABLED_MENU) {
          if(toSnakeCase(menu.name).toUpperCase() === key) {
            for(const permissionType of ENABLED_MENU[key]!) {
              if(permissionType === permission.name) {
                row.isEnabled = true;
                await row.save();
                break;
              }
            }
          }
        }
      }
    }
  }
}
