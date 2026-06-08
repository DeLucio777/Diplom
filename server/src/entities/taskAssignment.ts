export default class TaskAssignment {
    PK_AssignmentId: number;
    FK_TaskId: number;
    FK_ChildId: number;
    AssignedDate: string;
    DueDate?: string;
    Status: 'pending' | 'in_progress' | 'completed';
}