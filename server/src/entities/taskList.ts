import User from "./user";

export default class TaskList {
    PK_id: number;
    date_complite?: string;
    teacher_id: number;
    Teacher?: User;
    Description: string;
    Title: string;
    FK_achievement_id?: number;
    
}
