import { DefaultEntityBehaviour } from "../common/dto/common-dto";

export interface IRefreshToken {
  userId: string;
  token: string;
  isRevoked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RefreshTokenDomain implements DefaultEntityBehaviour<IRefreshToken> {
  private props: IRefreshToken;

  private constructor(props: IRefreshToken) {
    this.props = props;
  }

  public static create(props: IRefreshToken): RefreshTokenDomain {
    return new RefreshTokenDomain(props);
  }

  public unmarshal(): IRefreshToken {
    return {
      userId: this.userId,
      token: this.token,
      isRevoked: this.isRevoked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }
  get isRevoked(): boolean {
    return this.props.isRevoked;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
