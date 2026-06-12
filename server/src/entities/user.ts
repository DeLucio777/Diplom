import Role from "./role";

export default class User {
    PK_UserId: number;
    UserLogin: string;
    UserPassword: string;
    FK_RoleId?: number;
    Role?: Role;
    first_name?: string;
    second_name?: string;
    phone?: string;
    email?: string;
}
