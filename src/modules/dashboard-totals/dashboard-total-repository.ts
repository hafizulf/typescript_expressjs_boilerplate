import { injectable } from "inversify";
import { IDashboardTotalRepository } from "./dashboard-total-repository-interface";
import { DashboardTotal as DashboardTotalPersistence } from "@/modules/common/sequelize";
import { DashboardTotalDomain, IDashboardTotal } from "./dashboard-total-domain";

@injectable()
export class DashboardTotalRepository implements IDashboardTotalRepository {
  async findAll(): Promise<DashboardTotalDomain[]> {
    const data = await DashboardTotalPersistence.findAll();
    return data.map((el) => DashboardTotalDomain.create(el.toJSON()));
  }

  async createOrUpdate(props: IDashboardTotal): Promise<void> {
    const isExist = await DashboardTotalPersistence.findOne({ where: { name: props.name } });
    if(isExist) {
      await DashboardTotalPersistence.update(props, { where: { name: props.name } });
    } else {
      await DashboardTotalPersistence.create(props);
    }
  }
}
