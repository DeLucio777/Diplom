import Task from "./task";

export default class TaskConstruction {
  PK_ConstructionId: number;  // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_TaskId: number;          // INT NOT NULL (foreign key to Task)
  ParameterName: string;      // varchar(100) NOT NULL
  ParameterValue: string;     // varchar(1000) NOT NULL
  Help?: string;              // varchar(255)
  Task?: Task;                // optional navigation property
}
