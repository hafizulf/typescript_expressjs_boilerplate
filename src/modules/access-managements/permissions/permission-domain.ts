import { DomainEntity } from "@/modules/common/domainEntity";
import { DefaultEntityBehaviour } from "@/modules/common/dto/common-dto";

export interface IPermission {
  id?: string;
  name: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class PermissionDomain
  extends DomainEntity<IPermission>
  implements DefaultEntityBehaviour<IPermission>
{
  private constructor(props: IPermission) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IPermission): PermissionDomain {
    return new PermissionDomain(props);
  }

  unmarshal(): IPermission {
    return {
      id: this.id,
      name: this.name,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
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
}
