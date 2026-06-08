import User from "./user";

export default class Group {
  PK_Id: number;           // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_Teacher_id: number;   // INT NOT NULL (foreign key to User)
  Teacher?: User;          // optional navigation property
}
