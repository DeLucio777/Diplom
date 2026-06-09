import User from "./user";

export default class TaskList {
    PK_id: number;           // INT PRIMARY KEY
    Title: string;           // Task list title
    Descripti?: string;      // Description
    date_complite?: string;  // Deadline
    teacher_id: number;       // FK_User
    Teacher?: User;          // optional navigation property
}
