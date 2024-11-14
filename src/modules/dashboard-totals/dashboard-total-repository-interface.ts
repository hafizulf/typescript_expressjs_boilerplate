import { DashboardTotalDomain, IDashboardTotal } from "./dashboard-total-domain";

export interface IDashboardTotalRepository {
  findAll(): Promise<DashboardTotalDomain[]>
  createOrUpdate(props: IDashboardTotal): Promise<void>
}
