import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { IAnnouncementRepository } from "./announcement-repository-interface";
import { IAnnouncement } from "./announcement-domain";
import { SocketIO } from "@/libs/websocket";
import { DateRange } from "../common/dto/date-range.dto";
import { ANNOUNCEMENT_NSP } from "@/libs/websocket/namespaces/constants/namespace-constants";

@injectable()
export class AnnouncementService {
  constructor(
    @inject(TYPES.IAnnouncementRepository) private _repository: IAnnouncementRepository,
    @inject(TYPES.SocketIO) private _socketIO: SocketIO,
  ) {}

  public async store(props: IAnnouncement): Promise<IAnnouncement> {
    const storedData = (await this._repository.store(props)).unmarshal();

    // broadcast announcement event
    this._socketIO.broadcastMessage(`${ANNOUNCEMENT_NSP}`, "latest_announcements", JSON.stringify(storedData));

    return storedData;
  }

  public async findAll(dateRange?: DateRange): Promise<IAnnouncement[]> {
    console.log(dateRange);
    const data = await this._repository.findAll(dateRange);
    return data.map((el) => el.unmarshal());
  }

  public async findById(id: string): Promise<IAnnouncement> {
    return (await this._repository.findById(id)).unmarshal();
  }
}
