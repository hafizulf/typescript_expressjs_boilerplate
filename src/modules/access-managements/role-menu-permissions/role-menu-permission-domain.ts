import { IRole } from "@/modules/roles/role-domain";
import { IMenu } from "../menus/menu-domain";
import { IPermission } from "../permissions/permission-domain";
import { DomainEntity } from "@/modules/common/domainEntity";
import { DefaultEntityBehaviour } from "@/modules/common/dto/common-dto";

export interface IRoleMenuPermission {
  id?: string;
  roleId: string;
  menuId: string;
  permissionId: string;
  isPermitted: boolean;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  role?: IRole;
  menu?: IMenu;
  permission?: IPermission;
}

export class RoleMenuPermissionDomain
  extends DomainEntity<IRoleMenuPermission>
  implements DefaultEntityBehaviour<IRoleMenuPermission>
{
  private constructor(props: IRoleMenuPermission) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IRoleMenuPermission): RoleMenuPermissionDomain {
    return new RoleMenuPermissionDomain(props);
  }

  unmarshal(): IRoleMenuPermission {
    return {
      id: this.id,
      roleId: this.roleId,
      menuId: this.menuId,
      permissionId: this.permissionId,
      isPermitted: this.isPermitted,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      role: this.role,
      menu: this.menu,
      permission: this.permission,
    }
  }

  get id(): string {
    return this._id;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get menuId(): string {
    return this.props.menuId;
  }

  get permissionId(): string {
    return this.props.permissionId;
  }

  get isPermitted(): boolean {
    return this.props.isPermitted;
  }

  get updatedBy(): string {
    return this.props.updatedBy;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  get role(): IRole | undefined {
    return this.props.role;
  }

  get menu(): IMenu | undefined {
    return this.props.menu;
  }

  get permission(): IPermission | undefined {
    return this.props.permission;
  }
}

