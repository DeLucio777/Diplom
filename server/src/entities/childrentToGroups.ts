import User from "./user";
import Group from "./group";

export default class ChildrentToGroup {
  PK_Id: number;           // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_user_id: number;      // INT NOT NULL (foreign key to User)
  FK_group_id: number;     // INT NOT NULL (foreign key to Group)
  User?: User;             // optional navigation property
  Group?: Group;           // optional navigation property
}
