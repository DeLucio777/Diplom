import User from "./user";
import Group from "./group";

export default class ChildrentToGroup {
  PK_MemberId: number;           // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_GroupId: number;     // INT NOT NULL (foreign key to Group)
  FK_ChildId: number;     // INT NOT NULL (foreign key to Child)
  User?: User;             // optional navigation property
  Group?: Group;           // optional navigation property
}
