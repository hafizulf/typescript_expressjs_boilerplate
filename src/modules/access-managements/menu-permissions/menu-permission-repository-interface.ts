import { IMenuPermission, MenuPermissionDomain } from "./menu-permission-domain";
import { ListPermissionsByMenu } from "./menu-permission-dto";

export interface IMenuPermissionRepository {
  findAll(): Promise<MenuPermissionDomain[]>;
  findAllGroupByMenus(): Promise<ListPermissionsByMenu[]>;
  store(props: IMenuPermission): Promise<MenuPermissionDomain>;
  seedMenuPermission(updatedBy: string): Promise<void>;
}
