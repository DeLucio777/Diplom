import MediaCatalog from "./mediaCatalog";

export default class Achievement {
  id: number;              // INT PRIMARY KEY
  description?: string;    // varchar(255)
  name?: string;           // varchar(255)
  image_id?: number;       // INT UNIQUE (foreign key to MediaCatalog)
  Image?: MediaCatalog;    // optional navigation property
}
