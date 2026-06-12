import UserInfo from "./userInfo";

export default class Child {
    PK_UserId: number;
    UserLogin?: string;
    UserPassword?: string;
    FK_RoleId?: number;
    first_name?: string;
    second_name?: string;
    phone?: string;
    email?: string;
    ChildInfo?: UserInfo;
}
