import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { NotificationService } from "../_services/notification.service";
import { UserService } from "../_services/user.service";
import { AuthService } from "../_services/auth.service";

// Edited by Bilal Taha
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  roles = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  // Settings for register form to make sure it adheres to certain rules
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      role: [""],
      email: ["", [Validators.required, Validators.email]],
      username: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      userCase: [""],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });

    this.roles = [{ name: "User" }, { name: "Admin" }];
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log("Error in onSubmit()");
      return;
    }

    // We take the uppercase value of the username so we can compare to other registered names to make sure none are the same
    this.registerForm.value.userCase = this.registerForm.value.username.toUpperCase();

    this.loading = true;
    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          //  this.alertService.success('Registration successful', true);
          this.router.navigate(["/login"]);
        },
        error => {
          console.log("Error:", error);
          this.notification.showNotif(error);
          this.loading = false;
        }
      );
  }
}
