import { DomainEntity } from "../common/domainEntity";
import { DefaultEntityBehaviour } from "../common/dto/common-dto";

export interface IUserLogs {
  id?: string;
  description: string;
  createdBy: string;
  createdAt?: Date;
}

export class UserLogsDomain
  extends DomainEntity<IUserLogs>
  implements DefaultEntityBehaviour<IUserLogs> {
    constructor(props: IUserLogs) {
      super(props, props.id);
    }

    public static create(props: IUserLogs): UserLogsDomain {
      return new UserLogsDomain(props);
    }

    unmarshal(): IUserLogs {
      return {
        id: this.id,
        description: this.description,
        createdBy: this.createdBy,
        createdAt: this.createdAt,
      };
    }

    get id(): string {
      return this._id;
    }

    get description(): string {
      return this.props.description;
    }

    get createdBy(): string {
      return this.props.createdBy;
    }

    get createdAt(): Date | undefined {
      return this.props.createdAt;
    }
  }
