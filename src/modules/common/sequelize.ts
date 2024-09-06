import { Role } from "@/modules/roles/role-model";
import { User } from "@/modules/users/user-model";

(async () => {
  console.log("Sequelize initializing...");

  await Role.sync({ alter: false });
  await User.sync({ alter: true });

  console.log("Sequelize initialized!");
})();

// Models associations
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

export { Role, User };
