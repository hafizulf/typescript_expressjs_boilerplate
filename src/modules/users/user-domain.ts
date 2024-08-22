import { IMulterFile } from "@/modules/common/interfaces/multer-interface";
import { IRole } from "@/modules/roles/role-domain";

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
