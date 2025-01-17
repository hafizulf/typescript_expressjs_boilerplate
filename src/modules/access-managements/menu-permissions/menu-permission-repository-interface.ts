import { ListPermissionsByMenu } from "./menu-permission-repository";

export interface IMenuPermissionRepository {
  findAll(): Promise<ListPermissionsByMenu[]>;
  seedMenuPermission(updatedBy: string): Promise<void>;
}
