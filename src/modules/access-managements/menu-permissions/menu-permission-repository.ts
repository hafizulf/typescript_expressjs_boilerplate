import { injectable } from "inversify";
import { ENABLED_MENU } from "../menus/dto/enabled-menu";
import { IMenuPermissionRepository } from "./menu-permission-repository-interface";
import { MenuPermissionDomain } from "./menu-permission-domain";
import { Menu as MenuPersistence } from "@/modules/common/sequelize";
import { Permission as PermissionPersistence } from "@/modules/common/sequelize";
import { MenuPermission as MenuPermissionPersistence } from "@/modules/common/sequelize";
import { Op, Sequelize } from "sequelize";
import { toSnakeCase } from "@/libs/formatters";

@injectable()
export class MenuPermissionRepository implements IMenuPermissionRepository {
  async findAll(): Promise<MenuPermissionDomain[]> {
    const data = await MenuPermissionPersistence.findAll({
      attributes: [
        "id",
        "isEnabled",
        "menuId",
        "permissionId",
        [Sequelize.col("menu.name"), "menu"], // Alias menu.name to menu
        [Sequelize.col("permission.name"), "permission"]
      ],
      include: [
        {
          model: MenuPersistence,
          attributes: [], // Exclude attributes
        },
        {
          model: PermissionPersistence,
          attributes: [],
        },
      ],
      raw: true, // Return raw data
    });

    return data.map((el) => MenuPermissionDomain.create(el));
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
