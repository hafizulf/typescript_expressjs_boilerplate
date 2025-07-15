import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { IOriginRepository } from "./origin-repository-interface";
import { IOrigin } from "./origin-domain";
import { Pagination } from "../common/pagination";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { OriginType, TPropsCreateOrigin } from "./origin-dto";

@injectable()
export class OriginService {
  constructor(
    @inject(TYPES.IOriginRepository) private _repository: IOriginRepository,
  ) {}

  public store = async (props: TPropsCreateOrigin): Promise<IOrigin> => {
    const data = await this._repository.store(props);
    return data.unmarshal();
  }

  public findAll = async (
    paginateOption?: TStandardPaginateOption
  ): Promise<[IOrigin[], Pagination?]> => {
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

  public findById = async (id: string): Promise<IOrigin> => {
    return (await this._repository.findById(id)).unmarshal();
  }

  public update = async (id: string, props: IOrigin): Promise<IOrigin | null> => {
    return (await this._repository.update(id, props)).unmarshal();
  }

  public delete = async (id: string): Promise<boolean> => {
    return (await this._repository.delete(id));
  }

  public findAllByType = async (type: OriginType): Promise<IOrigin[]> => {
    return (await this._repository.findAllByType(type)).map((el) => el.unmarshal());
  }
}
