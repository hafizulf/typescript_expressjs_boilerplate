import { DomainEntity } from "../common/domainEntity";
import { DefaultEntityBehaviour } from "../common/dto/common-dto";

export interface IDashboardTotal {
  id?: string;
  name: string;
  totalCounted: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class DashboardTotalDomain
  extends DomainEntity<IDashboardTotal>
  implements DefaultEntityBehaviour<IDashboardTotal>
{
  private constructor(props: IDashboardTotal) {
    const {id, ...data} = props;
    super(data, id);
  }

  public static create(props: IDashboardTotal): DashboardTotalDomain {
    return new DashboardTotalDomain(props);
  }

  public unmarshal(): IDashboardTotal {
    return {
      id: this.id,
      name: this.name,
      totalCounted: this.totalCounted,
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

  get totalCounted(): number {
    return this.props.totalCounted;
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
