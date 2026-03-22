import CatalogPECS from "./catalogPECS";
import Task from "./task";

export default class SortItem {
  PK_SortItemId: number;       // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_TaskId: number;           // INT NOT NULL (foreign key to Task)
  ItemValue: string;           // varchar(255) NOT NULL
  SortKey: string;             // varchar(255) NOT NULL
  FK_pecsId?: number;          // INT (foreign key to CatalogPECS)
  Task?: Task;                 // optional navigation property
  PECS?: CatalogPECS;          // optional navigation property
}