import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { IPermission } from "./permission-domain";
import { IPermissionRepository } from "./permission-repository-interface";

@injectable()
export class PermissionService {
  constructor(
    @inject(TYPES.IPermissionRepository) private _repository: IPermissionRepository,
  ) {}

  public async findAll(): Promise<IPermission[]> {
    return (await this._repository.findAll()).map((el) => el.unmarshal());
  }

  public async store(props: IPermission): Promise<IPermission> {
    return (await this._repository.store(props)).unmarshal();
  }

  public async findById(id: string): Promise<IPermission> {
    return (await this._repository.findById(id)).unmarshal();
  }

  public async update(id: string, props: IPermission): Promise<IPermission> {
    return (await this._repository.update(id, props)).unmarshal();
  }

  public async delete(id: string): Promise<boolean> {
    return this._repository.delete(id);
  }
}
