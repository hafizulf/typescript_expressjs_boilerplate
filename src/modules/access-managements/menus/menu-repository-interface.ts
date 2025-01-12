import BaseRepository from "@/modules/common/interfaces/base-repository-interface";
import { IMenu, MenuDomain } from "./menu-domain";

export interface IMenuRepository
  extends Omit<
    BaseRepository<MenuDomain, IMenu>,
    'findAllWithPagination'
  > {
    findAllParents(): Promise<MenuDomain[]>;
    findChildsByParentId(parentId: string): Promise<MenuDomain[]>
  }
