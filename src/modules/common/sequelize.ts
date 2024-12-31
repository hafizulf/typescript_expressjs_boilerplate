import { Role } from "@/modules/roles/role-model";
import { User } from "@/modules/users/user-model";
import { RefreshToken } from "@/modules/refresh-tokens/refresh-token-model";
import { DashboardTotal } from "../dashboard-totals/dashboard-total-model";
import { Announcement } from "../announcements/announcement-models";
import { UserLogs } from "../user-logs/user-logs-model";

// Models associations
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

export async function sequelizeMigrate(): Promise<void> {
  try {
    console.log("Running database migrations...");

    await Promise.all([
      Role.sync({ alter: false }),
      User.sync({ alter: false }),
      RefreshToken.sync({ alter: false }),
      DashboardTotal.sync({ alter: false }),
      Announcement.sync({ alter: false }),
      UserLogs.sync({ alter: false }),
    ]);

    console.log("Database migrations completed.");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    process.exit(1);
  }
}

export {
  Role,
  User,
  RefreshToken,
  DashboardTotal,
  Announcement,
  UserLogs,
};
