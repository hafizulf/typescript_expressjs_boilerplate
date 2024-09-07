import { injectable } from "inversify";
import { TStandardPaginateOption } from "../common/dto/pagination-dto";
import { Pagination } from "../common/pagination";
import { UserDomain, IUser } from "./user-domain";
import { IUserRepository } from "./user-repository-interface";
import { User as UserPersistence } from "./user-model";
import { Role as RolePersistence } from "../roles/role-model";
import { Op, Sequelize } from "sequelize";
import { ICreateUserProps } from "./user-dto";
import { AppError, HttpCode } from "@/exceptions/app-error";

@injectable()
export class UserRepository implements IUserRepository {
  async findAll(): Promise<UserDomain[]> {
    const users = await UserPersistence.findAll();
    return users.map((el) => UserDomain.create(el.toJSON()));
  }

  async findAllWithPagination(
    paginateOption: TStandardPaginateOption,
    pagination: Pagination
  ): Promise<[UserDomain[], Pagination]> {
    const search = paginateOption.search;
    const orderBy = paginateOption.orderBy ? paginateOption.orderBy : "fullName";
    const sort = paginateOption.sort ? paginateOption.sort : "DESC";
    const searchCondition = search
      ? {
          [Op.or]: [
            {
              fullName: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${search}%`,
              },
            },
            Sequelize.literal(`"role"."name" ILIKE :search`),
          ],
        }
      : {};

    const { rows, count } = await UserPersistence.findAndCountAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: RolePersistence,
          attributes: ["name"],
        }
      ],
      where: {
        ...searchCondition,
      },
      replacements: { search: `%${search}%` },
      order: [
        orderBy === "role"
          ? [Sequelize.col("role.name"), sort]
          : [Sequelize.col(orderBy), sort],
      ],
      limit: pagination.limit,
      offset: pagination.offset,
    });

    pagination.generateMeta(count, rows.length);
    return [rows.map((el) => UserDomain.create(el.toJSON())), pagination];
  }

  async store(props: ICreateUserProps): Promise<UserDomain> {
    const isExistRole = await RolePersistence.findByPk(props.roleId);
    if(!isExistRole) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role not found",
      })
    }

    try {
      const createdUser = await UserPersistence.create(props)
      return UserDomain.create(createdUser.toJSON());
    } catch(e: Error | any) {
      if(e?.name === "SequelizeUniqueConstraintError") {
        throw new AppError({
          statusCode: HttpCode.CONFLICT,
          description: "Email already exists",
        })
      }

      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create user",
        error: e,
      });
    }
  }
  async findById(id: string): Promise<UserDomain> {
    const isExistUser = await UserPersistence.findByPk(id);
    if(!isExistUser) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User not found",
      })
    }

    return UserDomain.create(isExistUser.toJSON());
  }
  async update(id: string, props: Omit<IUser, "password">): Promise<UserDomain> {
    const user = await UserPersistence.findByPk(id);
    if(!user) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User not found",
      })
    }

    // check wether email already used by other user
    const isExistEmail = await UserPersistence.findOne({
      where: {
        email: props.email
      }
    })
    if(isExistEmail && isExistEmail.id !== id) {
      throw new AppError({
        statusCode: HttpCode.CONFLICT,
        description: "Email already exists",
      })
    }

    // Update User
    const updateProps = {
      fullName: props.fullName,
      email: props.email,
      avatarPath: typeof props.avatarPath === "string" ? props.avatarPath : undefined,
      roleId: props.roleId,
      updatedBy: props.updatedBy,
    };

    await user.update(updateProps, {
      where: {
        id
      }
    })
    await user.reload(); // reload to get updated data
    return UserDomain.create(user.toJSON());
  }

  async delete(id: string): Promise<UserDomain> {
    const isExistUser = await UserPersistence.findByPk(id);
    if(!isExistUser) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "User not found",
      })
    }

    await isExistUser.destroy();
    return UserDomain.create(isExistUser.toJSON());
  }

}
