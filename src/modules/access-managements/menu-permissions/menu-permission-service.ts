import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { IMenuPermissionRepository } from "./menu-permission-repository-interface";
import { ListPermissionsByMenu } from "./menu-permission-repository";

@injectable()
export class MenuPermissionService {
  constructor(
    @inject(TYPES.IMenuPermissionRepository) private _repository: IMenuPermissionRepository,
  ) {}

  public async findAll(): Promise<ListPermissionsByMenu[]> {
    return await this._repository.findAll();
  }

  public async seedMenuPermission(updatedBy: string): Promise<void> {
    return await this._repository.seedMenuPermission(updatedBy);
  }
}
