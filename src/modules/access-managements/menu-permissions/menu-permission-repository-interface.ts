import { MenuPermissionDomain } from "./menu-permission-domain";

export interface IMenuPermissionRepository {
  findAll(): Promise<MenuPermissionDomain[]>;
  seedMenuPermission(updatedBy: string): Promise<void>;
}
