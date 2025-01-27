import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { IMenuPermissionRepository } from "./menu-permission-repository-interface";
import { IMenuPermission } from "./menu-permission-domain";
import { ListPermissionsByMenu, ResponseFindMenuPermission, TPropsBulkUpdateMenuPermissions } from "./menu-permission-dto";
import { TStandardPaginateOption } from "@/modules/common/dto/pagination-dto";
import { Pagination } from "@/modules/common/pagination";

@injectable()
export class MenuPermissionService {
  constructor(
    @inject(TYPES.IMenuPermissionRepository)
    private _repository: IMenuPermissionRepository
  ) {}

  public async findAll(
    paginateOption?: TStandardPaginateOption
  ): Promise<[ResponseFindMenuPermission[], Pagination?]> {
    if(
      paginateOption?.search ||
      (paginateOption?.page && paginateOption?.limit)
    ) {
      const pagination = Pagination.create({
        page: <number>paginateOption.page,
        limit: <number>paginateOption.limit,
      })

      const [data, paginateResult] = await this._repository.findAllWithPagination(paginateOption, pagination);
      return [data.map((el) => {
        const unmarshalled = el.unmarshal();
        return {
          ...unmarshalled,
          menu: unmarshalled.menu!.name,
          permission: unmarshalled.permission!.name,
        };
      }), paginateResult];
    }

    return [(await this._repository.findAll()).map((el) => {
      const unmarshalled = el.unmarshal();
      return {
        ...unmarshalled,
        menu: unmarshalled.menu!.name,
        permission: unmarshalled.permission!.name,
      };
    })];
  }

  public async store(props: IMenuPermission): Promise<IMenuPermission> {
    return (await this._repository.store(props)).unmarshal();
  }

  public async findById(id: string): Promise<ResponseFindMenuPermission> {
    const data = await this._repository.findById(id);
    return {
      ...data.unmarshal(),
      menu: data.menu!.name,
      permission: data.permission!.name,
    };
  }

  public async findAllGroupByMenus(): Promise<ListPermissionsByMenu[]> {
    return await this._repository.findAllGroupByMenus();
  }

  public async bulkUpdate(
    props: TPropsBulkUpdateMenuPermissions[],
    updatedBy: string
  ): Promise<ListPermissionsByMenu[]> {
    const permissionsToUpdate = props.flatMap((el) =>
      el.permissionList.map((permission) => ({
        menuId: el.menuId,
        permissionId: permission.permissionId,
        isEnabled: permission.isEnabled,
        updatedBy,
      }))
    );

    await this._repository.bulkUpdate(permissionsToUpdate);

    return await this.findAllGroupByMenus();
  }

  public async seedMenuPermission(updatedBy: string): Promise<void> {
    return await this._repository.seedMenuPermission(updatedBy);
  }
}
