import User from "./user";

export default class TeacherInfo {
    PK_Id: number;
    FK_UserId: number;
    Teacher_Specialization?: string;
    User?: User;
}
