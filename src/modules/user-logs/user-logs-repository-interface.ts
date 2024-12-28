import BaseRepository from "../common/interfaces/base-repository-interface";
import { IUserLogs, UserLogsDomain } from "./user-logs-domain";
import { BaseQueryOption } from "../common/dto/common-dto";

export interface IUserLogsRepository
  extends Omit<
    BaseRepository<UserLogsDomain, IUserLogs>,
    'store' | 'findAll' | 'update' | 'delete'
  >
{
  store(props: IUserLogs, option: BaseQueryOption): Promise<UserLogsDomain>;
  getOldestUserLogs(): Promise<UserLogsDomain | null>;
  deleteUserLogsBefore(date: Date): Promise<void>;
}
