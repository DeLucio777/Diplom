export default class MatchImageWordPair {
  PK_PairId: number;           // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_TaskId: number;           // INT NOT NULL (foreign key to Task)
  FK_MediaId: number;          // INT NOT NULL (foreign key to MediaCatalog)
  FK_pecsId?: number;          // INT (foreign key to CatalogPECS)
  Words: string;               // varchar(255) NOT NULL
  Task?: Task;                 // optional navigation property
  Media?: MediaCatalog;        // optional navigation property
  PECS?: CatalogPECS;          // optional navigation property
}