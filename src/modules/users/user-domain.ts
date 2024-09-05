import { IMulterFile } from "@/modules/common/interfaces/multer-interface";
import { IRole } from "@/modules/roles/role-domain";
import { DomainEntity } from "../common/domainEntity";
import { DefaultEntityBehaviour } from "../common/dto/common-dto";

export interface IUser {
  id?: string;
  fullName: string;
  email: string;
  password?: string | null;
  avatarPath?: string | IMulterFile;
  roleId: string;
  role?: IRole;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class UserDomain
  extends DomainEntity<IUser>
  implements DefaultEntityBehaviour<IUser>
{

  private constructor(props: IUser) {
    const {id, ...data} = props;
    super(data, id);
  }

  public static create(props: IUser): UserDomain {
    return new UserDomain(props);
  }

  public unmarshal(): IUser {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      avatarPath: this.avatarPath,
      roleId: this.roleId,
      role: this.role,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }

  get id(): string {
    return this._id;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string | null | undefined {
    return this.props.password;
  }

  get avatarPath(): string | IMulterFile | undefined {
    return this.props.avatarPath;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get role(): IRole | undefined {
    return this.props.role;
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
