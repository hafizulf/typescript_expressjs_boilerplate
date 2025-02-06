import { IMulterFile } from "@/modules/common/interfaces/multer-interface";
import { IRole } from "@/modules/roles/role-domain";
import { DomainEntity } from "../common/domainEntity";
import { DefaultEntityBehaviour } from "../common/dto/common-dto";
import bcrypt from "bcryptjs";
import { AppError, HttpCode } from "@/exceptions/app-error";

export interface IUser {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
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
    const { id, ...data } = props;
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
    };
  }

  public verifyPassword(password: string): boolean {
    if (this.password) {
      return bcrypt.compareSync(password, this.password);
    }
    return false;
  }

  public generateRandomPassword(): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@$!%*?&';

    const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)]!;
    const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = randomLower + randomUpper + randomNumber + randomSymbol;

    // Add remaining characters to reach minimum length of 6
    for (let i = 4; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }

    // Shuffle the password to avoid predictable pattern
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
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

  get password(): string | undefined {
    return this.props.password;
  }
  set password(val: string | undefined | null) {
    if (val) {
      this.props.password = bcrypt.hashSync(val, 10);
    } else {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Password is required",
      });
    }
  }

  get avatarPath(): string | IMulterFile | undefined {
    return this.props.avatarPath;
  }
  set avatarPath(val: undefined | string | IMulterFile) {
    this.props.avatarPath = val;
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
