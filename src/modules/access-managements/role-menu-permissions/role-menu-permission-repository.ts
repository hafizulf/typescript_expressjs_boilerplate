import { AppError, HttpCode } from "@/exceptions/app-error";
import { injectable } from "inversify";
import { IRoleMenuPermission } from "./role-menu-permission-domain";
import { IRoleMenuPermissionRepository } from "./role-menu-permission-repository-interface";
import {
  Role as RolePersistence,
  Menu as MenuPersistence,
  Permission as PermissionPersistence,
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
}
