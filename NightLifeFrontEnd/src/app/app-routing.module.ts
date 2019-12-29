import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { Role } from "./_models/role";
import { AuthGuard } from "./_guards/auth.guard";
import { AdminComponent } from "./admin/admin.component";

// Setting up routes for the components
const routes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuard],

    // To get this data the user has to be an admin
    data: { roles: [Role.admin] }
  },

  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
