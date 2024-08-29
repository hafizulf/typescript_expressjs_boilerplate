import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { Pagination } from "@/modules/common/pagination";
import { IRole, Role } from "./role-domain";
import { updateRoleParams } from "./role-dto";

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findAllWithPagination(
    paginateOption: TStandardPaginateOption,
    pagination: Pagination
  ): Promise<[Role[], Pagination]>;
  store(props: IRole): Promise<Role>;
  findById(id: string): Promise<Role>;
  update(id: string, params: updateRoleParams): Promise<Role>;
  delete(id: string): Promise<boolean>;
}
