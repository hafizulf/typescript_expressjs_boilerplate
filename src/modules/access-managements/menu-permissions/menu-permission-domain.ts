import { DomainEntity } from "@/modules/common/domainEntity";
import { DefaultEntityBehaviour } from "@/modules/common/dto/common-dto";
import { IMenu } from "../menus/menu-domain";
import { IPermission } from "../permissions/permission-domain";

export interface IMenuPermission {
  id?: string;
  menuId: string;
  permissionId: string;
  isEnabled: boolean;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  menu?: IMenu;
  permission?: IPermission;
}

export class MenuPermissionDomain
  extends DomainEntity<IMenuPermission>
  implements DefaultEntityBehaviour<IMenuPermission>
{
  private constructor(props: IMenuPermission) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IMenuPermission): MenuPermissionDomain {
    return new MenuPermissionDomain(props);
  }

  unmarshal(): IMenuPermission {
    return {
      id: this.id,
      menuId: this.menuId,
      permissionId: this.permissionId,
      isEnabled: this.isEnabled,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      menu: this.menu,
      permission: this.permission,
    }
  }

  get id(): string {
    return this._id;
  }

  get menuId(): string {
    return this.props.menuId;
  }

  get permissionId(): string {
    return this.props.permissionId;
  }

  get isEnabled(): boolean {
    return this.props.isEnabled;
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

  get menu(): IMenu | undefined {
    return this.props.menu;
  }

  get permission(): IPermission | undefined {
    return this.props.permission;
  }
}
