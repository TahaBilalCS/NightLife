import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "../_models/user";

// Edited by Bilal Taha
@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    console.log("getAll()");
    return this.http.get<User[]>(`http://localhost:4000/user/allusers`);
  }

  register(user: User) {
    return this.http.post(`http://localhost:4000/user/register`, user);
  }

  addHighScore(user: User, score: string) {
    return this.http.post(`http://localhost:4000/user/highscore`, {
      user,
      score
    });
  }
}
