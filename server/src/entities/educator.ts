import User from "./user";

export default class Educator {
    PK_Id: number;
    FK_UserId: number;
    Teacher_Specialization?: string;
    User?: User;
}
