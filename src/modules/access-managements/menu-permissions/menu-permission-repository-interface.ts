import { IMenuPermission, MenuPermissionDomain } from "./menu-permission-domain";
import { ListPermissionsByMenu } from "./menu-permission-dto";

export interface IMenuPermissionRepository {
  findAll(): Promise<MenuPermissionDomain[]>;
  store(props: IMenuPermission): Promise<MenuPermissionDomain>;
  findAllGroupByMenus(): Promise<ListPermissionsByMenu[]>;
  bulkUpdate(props: IMenuPermission[]): Promise<void>;
  seedMenuPermission(updatedBy: string): Promise<void>;
}
