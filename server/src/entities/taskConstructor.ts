export default class TaskConstruction {
  PK_ConstructionId: number;  // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_TaskId: number;          // INT NOT NULL (foreign key to Task)
  ParameterName: string;       // varchar(100) NOT NULL
  ParameterValue: string;      // varchar(MAX) NOT NULL
  Task?: Task;                 // optional navigation property
}