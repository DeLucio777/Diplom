import CatalogPECS from "./catalogPECS";
import Task from "./task";

export default class FindOddOneOutItem {
  PK_ItemId: number;           // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_TaskId: number;           // INT NOT NULL (foreign key to Task)
  ItemText: string;            // varchar(255) NOT NULL
  IsOddOne: boolean;           // BIT NOT NULL
  FK_pecsId?: number;          // INT (foreign key to CatalogPECS)
  Task?: Task;                 // optional navigation property
  PECS?: CatalogPECS;          // optional navigation property
}