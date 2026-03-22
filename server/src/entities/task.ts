import TaskTemplate from "./taskTemplate";
import User from "./user";

export default class Task {
    PK_TaskId: number;       // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
    Title: string;           // varchar(50) NOT NULL
    Descripti?: string;      // varchar(50)
    FK_TemplateId: number;   // INT NOT NULL (foreign key to TaskTemplate)
    FK_UserId: number;       // INT NOT NULL (foreign key to User)
    Template?: TaskTemplate; // optional navigation property
    User?: User;             // optional navigation property
    DifficultyLevel:string;
    UploadDate:Date;
}
