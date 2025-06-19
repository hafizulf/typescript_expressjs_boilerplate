import { AppError, HttpCode } from "@/exceptions/app-error";
import { ENABLED_MENU } from "../menus/dto/enabled-menu";
import { IMenuPermission, MenuPermissionDomain } from "./menu-permission-domain";
import { IMenuPermissionRepository } from "./menu-permission-repository-interface";
import { injectable } from "inversify";
import { ListPermissionsByMenu } from "./menu-permission-dto";
import { Menu as MenuPersistence } from "@/modules/common/sequelize";
import { MenuPermission as MenuPermissionPersistence } from "@/modules/common/sequelize";
import { Op, Sequelize } from "sequelize";
import { Pagination } from "@/modules/common/pagination";
import { Permission as PermissionPersistence } from "@/modules/common/sequelize";
import {  RoleMenuPermission as RoleMenuPermissionPersistence } from "@/modules/common/sequelize";
import { toSnakeCase } from "@/libs/formatters";
import { TStandardPaginateOption } from "@/modules/common/dto/pagination-dto";
import { sequelize } from "@/config/database";
import { MenuPermissionErrMessage } from "@/exceptions/error-message-constants";

@injectable()
export class MenuPermissionRepository implements IMenuPermissionRepository {
  async findAll(): Promise<MenuPermissionDomain[]> {
    const data = await MenuPermissionPersistence.findAll({
      attributes: ['menuId', 'permissionId', 'isEnabled', 'createdAt'],
      include: [
        {
          model: MenuPersistence,
          attributes: ['name'],
        },
        {
          model: PermissionPersistence,
          attributes: ['name'],
        },
      ],
    });
    return data.map((el) => MenuPermissionDomain.create(el.toJSON()));
  }

  async findAllWithPagination(
    paginateOption: TStandardPaginateOption,
    pagination: Pagination
  ): Promise<[MenuPermissionDomain[], Pagination]> {
    const search = paginateOption.search;
    const orderBy = paginateOption.orderBy || 'menu.name';
    const sort = paginateOption.sort ? paginateOption.sort : 'DESC';
    const searchCondition = search
      ? {
          [Op.or]: [
            Sequelize.literal(`"menu"."name" ILIKE :search`),
            Sequelize.literal(`"permission"."name" ILIKE :search`),
          ],
        }
      : {};

    const { rows, count } = await MenuPermissionPersistence.findAndCountAll({
      attributes: ['menuId', 'permissionId', 'isEnabled', 'createdAt'],
      include: [
        {
          model: MenuPersistence,
          attributes: ['name'],
        },
        {
          model: PermissionPersistence,
          attributes: ['name'],
        },
      ],
      where: {
        ...searchCondition,
      },
      replacements: { search: `%${search}%` },
      order: [
        orderBy === 'menu'
          ? [Sequelize.col('menu.name'), sort]
          : orderBy === 'permission'
          ? [Sequelize.col('permission.name'), sort]
          : [Sequelize.col(orderBy), sort], // Root-level columns
      ],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    pagination.generateMeta(count, rows.length);
    return [
      rows.map((el) => MenuPermissionDomain.create(el.toJSON())),
      pagination,
    ];
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
          description: MenuPermissionErrMessage.ALREADY_EXISTS,
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

  async findById(id: string): Promise<MenuPermissionDomain> {
    const data = await MenuPermissionPersistence.findByPk(id, {
      attributes: ['menuId', 'permissionId', 'isEnabled', 'updatedBy', 'createdAt', 'updatedAt'],
      include: [
        {
          model: MenuPersistence,
          attributes: ['name'],
        },
        {
          model: PermissionPersistence,
          attributes: ['name'],
        },
      ],
    });

    if (!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: MenuPermissionErrMessage.NOT_FOUND,
      });
    }

    return MenuPermissionDomain.create(data.toJSON());
  }

  async update(
    id: string,
    props: IMenuPermission
  ): Promise<MenuPermissionDomain> {
    try {
      const data = await MenuPermissionPersistence.findByPk(id);
      if (!data) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: MenuPermissionErrMessage.NOT_FOUND,
        });
      }

      await data.update(props);
    } catch (e: Error | any) {
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

  async delete(id: string): Promise<boolean> {
    const transaction = await sequelize.transaction();
    try {
      const data = await MenuPermissionPersistence.findByPk(id, {
        transaction,
      });
      if (!data) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: MenuPermissionErrMessage.NOT_FOUND,
        });
      }

      const deletedRoleMenuPermissions =
        await RoleMenuPermissionPersistence.destroy({
          where: {
            menuId: data.menuId,
            permissionId: data.permissionId,
          },
          transaction,
        }); // Delete related records in RoleMenuPermissionPersistence`

      await data.destroy({ transaction }); // Delete the menu permission
      await transaction.commit();

      console.log(
        `Deleted ${deletedRoleMenuPermissions} related role menu permissions.`
      );

      return true;
    } catch (e: Error | any) {
      await transaction.rollback();

      if (e instanceof AppError) {
        throw e;
      }

      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: 'Failed to delete menu permission',
        error: e,
      });
    }
  }

  async findEnabledList(): Promise<MenuPermissionDomain[]> {
    const data = await MenuPermissionPersistence.findAll({
      attributes: ['menuId', 'permissionId', 'isEnabled'],
      include: [
        {
          model: MenuPersistence,
          attributes: ['name'],
        },
        {
          model: PermissionPersistence,
          attributes: ['name'],
        },
      ],
      where: {
        isEnabled: true,
      },
    });

    return data.map((el) => MenuPermissionDomain.create(el.toJSON()));
  }

  async findAllGroupByMenus(): Promise<ListPermissionsByMenu[]> {
    const data = await MenuPermissionPersistence.findAll({
      attributes: ['menuId', 'permissionId', 'isEnabled'],
      include: [
        {
          model: MenuPersistence,
          attributes: ['name', 'createdAt'],
        },
        {
          model: PermissionPersistence,
          attributes: ['name'],
        },
      ],
    });

    let result: ListPermissionsByMenu[] = [];
    for (const item of data) {
      const menu = result.find((el) => el.menuId === item.menuId);
      if (menu) {
        menu.permissionList.push({
          permissionId: item.permissionId,
          permission: item.permission?.name!,
          isEnabled: item.isEnabled,
        });
      } else {
        result.push({
          menuId: item.menuId,
          menu: item.menu?.name!,
          createdAt: item.menu?.createdAt!,
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

    return result.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async bulkUpdate(props: IMenuPermission[]): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await Promise.all(
        props.map(async (el) => {
          await MenuPermissionPersistence.update(
            { isEnabled: el.isEnabled },
            {
              where: {
                menuId: el.menuId,
                permissionId: el.permissionId,
              },
              transaction,
            }
          );
        })
      );

      await transaction.commit();
    } catch (e: Error | any) {
      await transaction.rollback();

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
  }

  async seedMenuPermission(updatedBy: string): Promise<void> {
    const menus = await MenuPersistence.findAll({
      where: {
        parentId: {
          [Op.ne]: null,
        },
      },
      order: [['createdAt', 'ASC']],
    });
    const permissions = await PermissionPersistence.findAll({
      order: [['createdAt', 'ASC']],
    });

    for (const menu of menus) {
      for (const permission of permissions) {
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
          },
        });

        // Enabling default permissions
        for (const key in ENABLED_MENU) {
          if (toSnakeCase(menu.name).toUpperCase() === key) {
            for (const permissionType of ENABLED_MENU[key]!) {
              if (permissionType === permission.name) {
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
