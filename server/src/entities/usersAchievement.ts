import Achievement from "./achievement";
import User from "./user";

export default class UsersAchievement {
    id: number;
    achivement_id?: number;
    user_id?: number;
    Achievement?: Achievement;
    User?: User;
}
