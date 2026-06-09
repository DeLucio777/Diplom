export default class ProgressRecord {
    PK_ProgressId: number;
    FK_AssignmentId: number;
    FK_ChildId: number;
    CompletedDate: string;
    ErrorCount: number;
    HintsUsed: number;
    TimeTakenSeconds?: number;
    IsCorrect: boolean;
}