import User from "./user";
import Disease from "./disease";

export default class UserInfo {
  PK_Id: number;           // INT NOT NULL IDENTITY(1,1) PRIMARY KEY
  FK_user_id: number;      // INT UNIQUE (foreign key to User)
  FK_disease_id?: number;  // INT (foreign key to Disease)
  complited_tasks_count?: number; // INT
  helpe_used_count?: number;      // INT
  miss_tasks_count?: number;      // INT
  age?: number;                   // INT
  User?: User;                    // optional navigation property
  Disease?: Disease;              // optional navigation property
  PerceptionFeatures?: string;
  SpeechLevel?: string;
  BackgroundColor?: string;
  FontSize?: number;
  ExcludeLoudSounds?: boolean;
  RewardAnimation?: string;
  FK_RepresentativeUserId?: number;
  FK_EducatorUserId?: number;
}
