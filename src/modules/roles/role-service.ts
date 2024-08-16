import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { IRoleRepository } from "./role-repository-interface";
import { IRole } from "./role-domain";

@injectable()
export class RoleService {
  constructor(
    @inject(TYPES.IRoleRepository) private _repository: IRoleRepository,
  ) {}

  public async findAll(): Promise<IRole[]> {
    return await this._repository.findAll();
  }
}
