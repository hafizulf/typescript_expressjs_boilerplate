import { DateRange } from "../common/dto/date-range.dto";
import { AnnouncementDomain, IAnnouncement } from "./announcement-domain";

export interface IAnnouncementRepository {
  store(props: IAnnouncement): Promise<AnnouncementDomain>;
  findAll(dateRange?: DateRange): Promise<AnnouncementDomain[]>;
  findById(id: string): Promise<AnnouncementDomain>;
}
