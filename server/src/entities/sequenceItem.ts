export default class SequenceItem {
  PK_SeqItemId: number;        // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_TaskId: number;           // INT NOT NULL (foreign key to Task)
  ItemOrder: number;           // INT NOT NULL
  ItemValue: string;           // varchar(255) NOT NULL
  FK_pecsId?: number;          // INT (foreign key to CatalogPECS)
  Task?: Task;                 // optional navigation property
  PECS?: CatalogPECS;          // optional navigation property
}
