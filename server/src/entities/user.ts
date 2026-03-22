import Role from "./role";

export default class User{
    PK_UserId: number;       // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
    UserLogin: string;       // varchar(50) NOT NULL
    UserPassword: string;    // varchar(50) NOT NULL
    FK_RoleId?: number;      // int (foreign key to Role)
    Role?: Role;             // optional navigation property
}
