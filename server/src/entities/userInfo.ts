import User from "./user";
import Disease from "./disease";

export default class UserInfo {
    PK_Id: number;
    FK_user_id: number;
    FK_disease_id?: number;
    complited_tasks_count?: number;
    helpe_used_count?: number;
    miss_tasks_count?: number;
    age?: number;
    speak_level?: string;
    User?: User;
    Disease?: Disease;
}
