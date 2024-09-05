import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { IUser } from "./user-domain";
import { Pagination } from "../common/pagination";
import { IUserRepository } from "./user-repository-interface";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.IUserRepository) private _repository: IUserRepository
  ) {}

  public async findAll(
    paginateOption?: TStandardPaginateOption
  ): Promise<[IUser[], Pagination?]> {
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
}
