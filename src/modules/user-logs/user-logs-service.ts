import dayjs from 'dayjs';
import { inject, injectable } from "inversify";
import { IUserLogsRepository } from "./user-logs-repository-interface";
import TYPES from "@/types";

@injectable()
export class UserLogsService {
  constructor(
    @inject(TYPES.IUserLogsRepository) private _userLogsRepository: IUserLogsRepository,
  ) {}

  public async deleteOldUserLogs(): Promise<void> {
    const sevenDaysAgo = dayjs().subtract(7, 'days').startOf('day'); // Calculate the cutoff date
    await this._userLogsRepository.deleteUserLogsBefore(sevenDaysAgo.toDate());
  }
}
