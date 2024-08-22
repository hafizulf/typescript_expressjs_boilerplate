import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { Pagination } from "@/modules/common/pagination";
import { Role } from "./role-domain";

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findAllWithPagination(
    paginateOption: TStandardPaginateOption,
    pagination: Pagination
  ): Promise<[Role[], Pagination]>;
}
