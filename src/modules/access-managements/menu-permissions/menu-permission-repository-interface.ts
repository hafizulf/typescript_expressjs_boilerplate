import BaseRepository from "@/modules/common/interfaces/base-repository-interface";
import { IMenuPermission, MenuPermissionDomain } from "./menu-permission-domain";
import { ListPermissionsByMenu } from "./menu-permission-dto";

export interface IMenuPermissionRepository extends BaseRepository<MenuPermissionDomain, IMenuPermission> {
  findAllGroupByMenus(): Promise<ListPermissionsByMenu[]>;
  bulkUpdate(props: IMenuPermission[]): Promise<void>;
  seedMenuPermission(updatedBy: string): Promise<void>;
}
