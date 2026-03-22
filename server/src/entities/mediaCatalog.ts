export default class MediaCatalog {
    PK_MediaId: number;      // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
    FileType: string;        // varchar(100) NOT NULL
    FilePath: string;        // varchar(250) NOT NULL
    Descripti?: string;      // varchar(50)
    UploadDate?: Date;       // DATETIME
}