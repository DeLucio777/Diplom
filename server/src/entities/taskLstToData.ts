import Task from "./task";
import TaskList from "./taskList";
import User from "./user";

export default class TaskLstToData {
    id: number;
    task_id?: number;
    task_list_id?: number;
    position?: number;
    user_id?: number;
    complited?: boolean;
    Task?: Task;
    TaskList?: TaskList;
    User?: User;
}
