import BaseRepository from "@/modules/common/interfaces/base-repository-interface";
import { IPermission, PermissionDomain } from "./permission-domain";

export interface IPermissionRepository
  extends Omit<
    BaseRepository<PermissionDomain, IPermission>,
    'findAllWithPagination'
  > { }
