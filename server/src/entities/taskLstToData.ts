import Task from "./task";
import TaskList from "./taskList";
import User from "./user";

export default class TaskLstToData {
  id: number;              // INT PRIMARY KEY
  task_id?: number;        // INT (foreign key to Task)
  task_list_id?: number;   // INT (foreign key to TaskList)
  position?: number;       // INT
  user_id?: number;        // INT (foreign key to User)
  complited?: boolean;     // BIT
  Task?: Task;             // optional navigation property
  TaskList?: TaskList;     // optional navigation property
  User?: User;             // optional navigation property
}
