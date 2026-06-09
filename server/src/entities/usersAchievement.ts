import Achievement from "./achievement";
import User from "./user";

export default class UsersAchievement {
  id: number;              // INT PRIMARY KEY
  achivement_id?: number;  // INT (foreign key to Achievement)
  user_id?: number;        // INT (foreign key to User)
  awardedAt?: Date;
  Achievement?: Achievement; // optional navigation property
  User?: User;             // optional navigation property
}
