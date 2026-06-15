export default class ProgressRecord {
    id: number;
    user_id: number;
    task_id?: number;
    task_list_id?: number;
    completed: boolean;
    completed_tasks_count?: number;
    helps_used_count?: number;
    missed_tasks_count?: number;
    age?: number;
    speak_level?: string;
}
