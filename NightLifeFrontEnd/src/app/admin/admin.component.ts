import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";

import { User } from "../_models/user";
import { UserService } from "../_services/user.service";

// Edited by Bilal Taha
@Component({
  templateUrl: "admin.component.html",
  styleUrls: ["admin.component.css"]
})

// For all users, we want to list them in our admin page so we can view their username, role, and highscore
export class AdminComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log("admin component");
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(users => {
        this.users = users;
      });
  }
}
