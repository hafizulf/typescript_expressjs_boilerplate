export interface ICreateUserProps {
  fullName: string;
  email: string;
  password: string;
  avatarPath: string;
  roleId: string;
  updatedBy: string;
}

export interface TParamsChangePassword {
  id: string;
  oldPassword: string;
  newPassword: string;
  updatedBy: string;
}

export interface TPropsUpdatePassword {
  id: string;
  password: string;
  updatedBy: string;
}
