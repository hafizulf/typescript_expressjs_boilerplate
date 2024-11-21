import { injectable } from "inversify";
import { IAnnouncementRepository } from "./announcement-repository-interface";
import { AnnouncementDomain, IAnnouncement } from "./announcement-domain";
import { Announcement as AnnouncementPersistence } from "./announcement-models";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { DateRange } from "../common/dto/date-range.dto";
import moment from 'moment-timezone';
import { Op } from "sequelize";

@injectable()
export class AnnouncementRepository implements IAnnouncementRepository {
  async store(props: IAnnouncement): Promise<AnnouncementDomain> {
    const data = await AnnouncementPersistence.create(props);
    return AnnouncementDomain.create(data.toJSON());
  }

  async findAll(dateRange?: DateRange): Promise<AnnouncementDomain[]> {
    const whereCondition: Record<string, unknown> = {};

    if (dateRange?.from || dateRange?.to) {
      whereCondition.createdAt = {
        ...(dateRange.from ? { [Op.gte]: moment(dateRange.from).toDate() } : {}),
        ...(dateRange.to ? { [Op.lte]: moment(dateRange.to).toDate() } : {}),
      };
    }

    const data = await AnnouncementPersistence.findAll({ where: whereCondition });
    return data.map((el) => AnnouncementDomain.create(el.toJSON()));
  }

  async findById(id: string): Promise<AnnouncementDomain> {
    const data = await AnnouncementPersistence.findOne({ where: { id } });

    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Announcement not found",
      });
    }

    return AnnouncementDomain.create(data.toJSON());
  }
}
