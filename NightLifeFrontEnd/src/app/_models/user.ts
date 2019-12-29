import { Role } from "./role";

// Class User to be used in project that has these properties
export class User {
  username: string;
  _id: string;
  password: string;
  role: Role;
  token?: string;
  highscore: string;
}
