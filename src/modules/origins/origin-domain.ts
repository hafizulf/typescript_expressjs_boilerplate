import { DomainEntity } from "../common/domainEntity";
import { DefaultEntityBehaviour } from "../common/dto/common-dto";

export interface IOrigin {
  id?: string;
  origin: string;
  type: 'http' | 'ws';
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Origin
  extends DomainEntity<IOrigin>
  implements DefaultEntityBehaviour<IOrigin>
{
  private constructor(props: IOrigin) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IOrigin): Origin {
    return new Origin(props);
  }

  unmarshal(): IOrigin {
    return {
      id: this.id,
      origin: this.origin,
      type: this.type,
      isBlocked: this.isBlocked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get origin(): string {
    return this.props.origin;
  }

  get type(): 'http' | 'ws' {
    return this.props.type;
  }

  get isBlocked(): boolean {
    return this.props.isBlocked;
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
