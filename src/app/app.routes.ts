import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/components/login/login.component";
import { SignupComponent } from "./auth/components/sign-up/sign-up.component";
import { AuthGuard } from "./auth/guard/auth.guard";
import { EntrepreneurshipDetailComponent } from "./features/entrepreneurship/components/entrepreneurship-detail/entrepreneurship-detail.component";
import { EntrepreneurshipFormComponent } from "./features/entrepreneurship/components/entrepreneurship-form/entrepreneurship-form.component";
import { EntrepreneurshipListComponent } from "./features/entrepreneurship/components/entrepreneurship-list/entrepreneurship-list.component";
import { ProfileListComponent } from "./features/profile/profile-list/profile-list.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { EntrepreneurshipsUpdatesComponent } from "./features/entrepreneurship/components/entrepreneurships-updates/entrepreneurships-updates.component";


export const routes: Routes = [
  { path: 'sign-in', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'entrepreneurships', component: EntrepreneurshipListComponent },
  { path: 'add-entrepreneurship', component: EntrepreneurshipFormComponent, canActivate: [AuthGuard] },
  { path: 'entrepreneurships/:id', component: EntrepreneurshipDetailComponent },
  { path: 'profile', component: ProfileListComponent, canActivate: [AuthGuard] },
  { path: 'update-entrepreneurships/:id', component: EntrepreneurshipsUpdatesComponent,canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
