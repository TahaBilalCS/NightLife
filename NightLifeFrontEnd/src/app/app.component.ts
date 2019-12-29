import { Component } from "@angular/core";

// Added

import { AuthService } from "./_services/auth.service";
import { Router } from "@angular/router";
import { NotificationService } from "./_services/notification.service";
import { User } from "./_models/user";
import { Role } from "./_models/role";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

// Edited by Bilal Taha
export class AppComponent {
  title = "NightLife";
  currentUser: User;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.currentUser.subscribe(x => (this.currentUser = x));
    // Change difficulty if button is pressed
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.admin;
  }

  get isUser() {
    return this.currentUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  // To fix game breaking bugs we reload the page when we navigate back to the home game area
  reloadHome() {
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }
}
