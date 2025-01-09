import { DomainEntity } from "@/modules/common/domainEntity";
import { DefaultEntityBehaviour } from "@/modules/common/dto/common-dto";

export interface IMenu {
  id?: string;
  name: string;
  path: string;
  icon: string | null;
  parentId: string | null;
  isActive: boolean;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class MenuDomain
  extends DomainEntity<IMenu>
  implements DefaultEntityBehaviour<IMenu>
{
  private constructor(props: IMenu) {
    const { id, ...data } = props;
    super(data, id)
  }

  public static create(props: IMenu): MenuDomain {
    return new MenuDomain(props);
  }

  unmarshal(): IMenu {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      icon: this.icon,
      parentId: this.parentId,
      isActive: this.isActive,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get path(): string {
    return this.props.path;
  }

  get icon(): string | null {
    return this.props.icon;
  }

  get parentId(): string | null {
    return this.props.parentId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get updatedBy(): string {
    return this.props.updatedBy;
  }

  set updatedBy(val: string) {
    this.props.updatedBy = val;
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
}
