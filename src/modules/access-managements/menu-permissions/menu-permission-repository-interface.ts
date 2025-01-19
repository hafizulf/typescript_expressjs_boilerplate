import { IMenuPermission, MenuPermissionDomain } from "./menu-permission-domain";

export interface IMenuPermissionRepository {
  findAll(): Promise<MenuPermissionDomain[]>;
  store(props: IMenuPermission): Promise<MenuPermissionDomain>;
  seedMenuPermission(updatedBy: string): Promise<void>;
}
