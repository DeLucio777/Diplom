import User from "./user";

export default class TaskList {
  PK_id: number;           // INT PRIMARY KEY
  date_complite?: Date;    // DATETIME
  teacher_id?: number;     // INT UNIQUE (foreign key to User)
  Teacher?: User;          // optional navigation property
}
