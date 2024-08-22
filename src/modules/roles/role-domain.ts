import { DomainEntity } from "../common/domainEntity";
import { DefaultEntityBehaviour } from "../common/dto/common-dto";

export interface IRole {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Role
  extends DomainEntity<IRole>
  implements DefaultEntityBehaviour<IRole>
{
  private constructor(props: IRole) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IRole): Role {
    return new Role(props);
  }

  unmarshal(): IRole {
    return {
      id: this.id,
      name: this.name,
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
