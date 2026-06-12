import User from "./user";
import Group from "./group";

export default class ChildrentToGroup {
    PK_Id: number;
    FK_user_id: number;
    FK_group_id: number;
    User?: User;
    Group?: Group;
}
