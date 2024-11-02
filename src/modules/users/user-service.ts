import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { IUser, UserDomain } from "./user-domain";
import { Pagination } from "../common/pagination";
import { IUserRepository } from "./user-repository-interface";
import { FileSystem } from "@/libs/file-system";
import { IMulterFile } from "../common/interfaces/multer-interface";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { TParamsChangePassword } from "./user-dto";
import { RedisClient } from "@/libs/redis/redis-client";
import { USER_ROLE_EXPIRATION } from "@/libs/redis/redis-env";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.IUserRepository) private _repository: IUserRepository
  ) {}

  public async findAll(
    paginateOption?: TStandardPaginateOption
  ): Promise<[IUser[], Pagination?]> {
    if(
      paginateOption?.search ||
      (paginateOption?.page && paginateOption?.limit)
    ) {
      const pagination = Pagination.create({
        page: <number>paginateOption.page,
        limit: <number>paginateOption.limit,
      })
      const [data, paginateResult] = await this._repository.findAllWithPagination(paginateOption, pagination);
      return [data.map((el) => el.unmarshal()), paginateResult];
    }

    return [(await this._repository.findAll()).map((el) => el.unmarshal())];
  }

  public async store(props: IUser): Promise<Omit<IUser, "password">> {
    try {
      const userData = UserDomain.create(props);
      userData.password = props.password; // trigger setter to hash password

      if(typeof props.avatarPath === "object") {
        const avatarPath = FileSystem.getPath(props.avatarPath, "user/avatars");
        userData.avatarPath = avatarPath;
      } else {
        userData.avatarPath = props.avatarPath || "";
      }

      const safeProps = {
        ...props,
        avatarPath: userData.avatarPath,
        password: userData.password!,
      };

      const user = await this._repository.store(safeProps);
      if(typeof props.avatarPath === "object") {
        // store avatar after user created successfully
        FileSystem.store(props.avatarPath, "user/avatars");
      }

      const { password, ...restData } = user.unmarshal();
      return restData;
    } catch (error: Error | any) {
      console.error("Error updating user:", error);

      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "An error occurred while updating the user.",
        data: error.message,
      });
    }
  }

  public async findById(id: string): Promise<IUser> {
    return (await this._repository.findById(id)).unmarshal();
  }

  public async update(props: Omit<IUser, "password">): Promise<Omit<IUser, "password">> {
    try {
      const userData = await this._repository.findById(props.id!);
      const reqAvatarPath = props.avatarPath;

      if(typeof props.avatarPath === "object") {
        const avatarPath = FileSystem.getPath(props.avatarPath, "user/avatars");
        props.avatarPath = avatarPath;
      }

      const updatedUser = await this._repository.update(userData.id, props);
      // if user updated successfully && avatar uploaded, update avatar
      if(typeof reqAvatarPath === "object") {
        FileSystem.update(<IMulterFile>reqAvatarPath, "user/avatars", <string>userData.avatarPath);
      }

      // if user role changed, update user role name incache
      if(updatedUser.roleId !== userData.roleId) {
        await RedisClient.set(`userRole:${updatedUser.id}`, updatedUser.role!.name, USER_ROLE_EXPIRATION);
      }

      const { password, role, ...restData } = updatedUser.unmarshal();
      return restData;
    } catch (error: Error | any) {
      console.error("Error updating user:", error);

      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "An error occurred while updating the user.",
        data: error.message,
      });
    }
  }

  public async destroy(id: string): Promise<boolean> {
    const deletedUserData = (await this._repository.delete(id)).unmarshal();

    if(deletedUserData.avatarPath) {
      FileSystem.destroy(<string>deletedUserData.avatarPath);
    }
    return true;
  }

  public async changePassword(params: TParamsChangePassword): Promise<boolean> {
    const {
      id,
      oldPassword,
      newPassword,
      updatedBy,
    } = params;

    const user = await this._repository.findById(id);
    const isVerified = user.verifyPassword(oldPassword);
    if(!isVerified) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Old password is incorrect",
      });
    }

    /*
      set new password and...
      reuse verifyPassword to compare old password with new password
    */
    user.password = newPassword;
    const isSamePassword = user.verifyPassword(oldPassword);
    if (isSamePassword) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "New password must be different from the old password",
      });
    }

    user.updatedBy = updatedBy;
    await this._repository.updatePassword({
      id,
      password: user.password,
      updatedBy: user.updatedBy
    })

    return true;
  }
}
