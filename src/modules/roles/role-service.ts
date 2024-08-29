import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { IRoleRepository } from "./role-repository-interface";
import { IRole } from "./role-domain";
import { TStandardPaginateOption } from "@/modules/common/dto/pagination-dto";
import { Pagination } from "@/modules/common/pagination";

@injectable()
export class RoleService {
  constructor(
    @inject(TYPES.IRoleRepository) private _repository: IRoleRepository,
  ) {}

  public async findAll(
    paginateOption?: TStandardPaginateOption
  ): Promise<[IRole[], Pagination?]> {
    if(
      paginateOption?.search ||
      (paginateOption?.page && paginateOption?.limit)
    ) {
      const pagination = Pagination.create({
        page: <number>paginateOption.page,
        limit: <number>paginateOption.limit,
      })
      const [data, paginateResult] = await this._repository.findAllWithPagination(paginateOption, pagination);
      return [data.map((el) => el.unmarshal()), paginateResult];
    }

    return [(await this._repository.findAll()).map((el) => el.unmarshal())];
  }

  public async store(props: IRole): Promise<IRole> {
    return (await this._repository.store(props)).unmarshal();
  }

  public async findById(id: string): Promise<IRole> {
    return (await this._repository.findById(id)).unmarshal();
  }

  public async update(id: string, props: IRole): Promise<IRole> {
    return (await this._repository.update(id, props)).unmarshal();
  }

  public async delete(id: string): Promise<boolean> {
    return (await this._repository.delete(id));
  }
}
