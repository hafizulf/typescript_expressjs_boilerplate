import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { IMenuPermission } from "./menu-permission-domain";
import { IMenuPermissionRepository } from "./menu-permission-repository-interface";

@injectable()
export class MenuPermissionService {
  constructor(
    @inject(TYPES.IMenuPermissionRepository) private _repository: IMenuPermissionRepository,
  ) {}

  public async findAll(): Promise<IMenuPermission[]> {
    return (await this._repository.findAll()).map((el) => el.unmarshal());
  }

  public async seedMenuPermission(updatedBy: string): Promise<void> {
    return await this._repository.seedMenuPermission(updatedBy);
  }
}
