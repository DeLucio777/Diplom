export default class CatalogPECS {
  PK_PECSid: number;       // int NOT NULL IDENTITY(1,1) PRIMARY KEY
  Descripti?: string;      // varchar(50)
  filePath: string;        // varchar(250) NOT NULL
  Category: string;        // varchar(50) NOT NULL
  UploadDate?: Date;       // DATETIME
}