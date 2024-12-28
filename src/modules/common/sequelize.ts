import { Role } from "@/modules/roles/role-model";
import { User } from "@/modules/users/user-model";
import { RefreshToken } from "@/modules/refresh-tokens/refresh-token-model";
import { DashboardTotal } from "../dashboard-totals/dashboard-total-model";
import { Announcement } from "../announcements/announcement-models";
import { UserLogs } from "../user-logs/user-logs-model";

(async () => {
  console.log("Sequelize initializing...");

  await Role.sync({ alter: false });
  await User.sync({ alter: false });
  await RefreshToken.sync({ alter: false });

  await DashboardTotal.sync({ alter: false });
  await Announcement.sync({ alter: false });
  await UserLogs.sync({ alter: false });

  console.log("Sequelize initialized!");
})();

// Models associations
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

export {
  Role,
  User,
  RefreshToken,
  DashboardTotal,
  Announcement,
  UserLogs,
};
