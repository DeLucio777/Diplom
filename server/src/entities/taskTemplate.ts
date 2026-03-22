export default class TaskTemplate {
    PK_TemplateId: number;   // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
    TemplateName: string;    // varchar(100) NOT NULL
    Descripti?: string;      // varchar(255)
}