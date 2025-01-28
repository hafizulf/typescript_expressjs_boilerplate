import { AppError, HttpCode } from "@/exceptions/app-error";
import { injectable } from "inversify";
import { IRoleMenuPermission, RoleMenuPermissionDomain } from "./role-menu-permission-domain";
import { IRoleMenuPermissionRepository } from "./role-menu-permission-repository-interface";
import {
  Role as RolePersistence,
  Menu as MenuPersistence,
  Permission as PermissionPersistence,
  MenuPermission as MenuPermisonPersistence,
  RoleMenuPermission as RoleMenuPermissionPersistence,
} from '@/modules/common/sequelize';
import { RoleMenuPermissionDto } from "./role-menu-permission-dto";
import { sequelize } from "@/config/database";

@injectable()
export class RoleMenuPermissionRepository
  implements IRoleMenuPermissionRepository
{
  async findByRoleId(roleId: string): Promise<RoleMenuPermissionDto | []> {
    const role = await RolePersistence.findByPk(roleId);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: 'Role not found',
      });
    }

    const data = await RoleMenuPermissionPersistence.findAll({
      attributes: ['menuId', 'permissionId', 'isPermitted'],
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
      where: { roleId },
    });

    if (data.length === 0) {
      return [];
    }

    let result: RoleMenuPermissionDto = {
      roleId,
      role: role.name,
      menus: [],
    };

    for (const item of data) {
      let menu = result.menus.find((m) => m.menuId === item.menuId);
      if (!menu) {
        menu = {
          menuId: item.menuId,
          menu: item.menu!.name,
          permissionList: [],
        };
        result.menus.push(menu);
      }

      menu.permissionList.push({
        permissionId: item.permissionId,
        permission: item.permission!.name,
        isPermitted: item.isPermitted,
      });
    }

    return result;
  }

  async bulkUpdate(props: IRoleMenuPermission[]): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      for (const item of props) {
        const [affectedCount] = await RoleMenuPermissionPersistence.update(
          { isPermitted: item.isPermitted },
          {
            where: {
              roleId: item.roleId,
              menuId: item.menuId,
              permissionId: item.permissionId,
            },
            transaction,
          }
        );

        // Silent handling: if no record is found, just log and proceed
        if (affectedCount === 0) {
          console.log(
            `No permission found for roleId: ${item.roleId}, menuId: ${item.menuId}, permissionId: ${item.permissionId}`
          );
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: 'Failed to update role menu permission',
        error,
      });
    }
  }

  async store(props: IRoleMenuPermission): Promise<RoleMenuPermissionDomain> {
    try {
      const menuPermission = await MenuPermisonPersistence.findOne({
        where: {
          menuId: props.menuId,
          permissionId: props.permissionId,
        },
      });

      if (!menuPermission) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: 'Menu permission not found',
        });
      }

      if (!menuPermission?.isEnabled) {
        throw new AppError({
          statusCode: HttpCode.BAD_REQUEST,
          description: 'Menu permission is disabled',
        });
      }

      const roleMenuPermission = await RoleMenuPermissionPersistence.findOne({
        where: {
          roleId: props.roleId,
          menuId: props.menuId,
          permissionId: props.permissionId,
        },
      });

      if (roleMenuPermission) {
        throw new AppError({
          statusCode: HttpCode.BAD_REQUEST,
          description: 'Role menu permission already exists',
        });
      }

      const createdRoleMenuPermission = await RoleMenuPermissionPersistence.create(props);
      return RoleMenuPermissionDomain.create(createdRoleMenuPermission.toJSON());
    } catch (e: unknown | any) {
      if(e.name === 'SequelizeForeignKeyConstraintError') {
        throw new AppError({
          statusCode: HttpCode.BAD_REQUEST,
          description: "Invalid reference: Role, Menu, or Permission does not exist",
        });
      }

      if(e instanceof AppError) {
        throw e;
      }

      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to store role menu permission",
        error: e,
      });
    }
  }

  async update(props: IRoleMenuPermission): Promise<RoleMenuPermissionDomain> {
    try {
      const roleMenuPermission = await RoleMenuPermissionPersistence.findOne({
        where: {
          roleId: props.roleId,
          menuId: props.menuId,
          permissionId: props.permissionId,
        },
      });

      if (!roleMenuPermission) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: 'Role menu permission not found',
        });
      }

      await roleMenuPermission.update({ isPermitted: props.isPermitted });
      return RoleMenuPermissionDomain.create(roleMenuPermission.toJSON());
    } catch (e: unknown | any) {
      if(e.name === 'SequelizeForeignKeyConstraintError') {
        throw new AppError({
          statusCode: HttpCode.BAD_REQUEST,
          description: "Invalid reference: Role, Menu, or Permission does not exist",
        });
      }

      if(e instanceof AppError) {
        throw e;
      }

      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to update role menu permission",
        error: e,
      });
    }
  }
}
