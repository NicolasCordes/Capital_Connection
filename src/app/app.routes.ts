import { Routes } from "@angular/router";
import { AuthGuard } from "./auth/guard/auth.guard";
import { ProfileListComponent } from "./features/profile/profile-list/profile-list.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { SignupPageComponent } from "./pages/signup-page/signup-page.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { EntrepreneurshipDetailPageComponent } from "./pages/entrepreneurship-detail-page/entrepreneurship-detail-page.component";
import { EntrepreneurshipFormPageComponent } from "./pages/entrepreneurship-form-page/entrepreneurship-form-page.component";
import { EntrepreneurshipListPageComponent } from "./pages/entrepreneurship-list-page/entrepreneurship-list-page.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";

export const routes: Routes = [
  { path: 'sign-up', component: SignupPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'entrepreneurships', component: EntrepreneurshipListPageComponent },
  { path: 'add-entrepreneurship', component: EntrepreneurshipFormPageComponent, canActivate: [AuthGuard] },
  { path: 'entrepreneurships/:id', component: EntrepreneurshipDetailPageComponent },
  { path: 'profile', component: ProfilePageComponent  , canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
