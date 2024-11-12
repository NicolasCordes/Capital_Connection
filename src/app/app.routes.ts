import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/components/login/login.component";
import { SignupComponent } from "./auth/components/sign-up/sign-up.component";
import { guardGuard } from "./auth/guard/guard.guard";
import { EntrepreneurshipDetailComponent } from "./features/entrepreneurship/components/entrepreneurship-detail-component/entrepreneurship-detail-component.component";
import { EntrepreneurshipFormComponent } from "./features/entrepreneurship/components/entrepreneurship-form-component/entrepreneurship-form-component.component";
import { EntrepreneurshipListComponent } from "./features/entrepreneurship/components/entrepreneurship-list-component/entrepreneurship-list-component.component";
import { FavoriteListComponent } from "./features/favorite-list/components/list-favorite/favorite-list.component";
import { ProfileListComponent } from "./features/profile/profile-list/profile-list.component";
import { UserFormComponent } from "./features/user/components/user-form/user-form.component";
import { UserListComponent } from "./features/user/components/user-list/user-list.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { EntrepreneurshipsUpdatesComponent } from "./features/entrepreneurship/components/entrepreneurships-updates/entrepreneurships-updates.component";
import { DonationPageComponent } from "./pages/donation-page/donation-page.component";


export const routes: Routes = [
  { path: 'sign-in', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'entrepreneurships', component: EntrepreneurshipListComponent },
  { path: 'add-entrepreneurship', component: EntrepreneurshipFormComponent, canActivate: [guardGuard] },
  { path: 'entrepreneurships/:id', component: EntrepreneurshipDetailComponent },
  { path: 'user-add', component: UserFormComponent },
  { path: 'users', component: UserListComponent },
  { path: 'profile', component: ProfileListComponent, canActivate: [guardGuard] },
  { path: 'favorites/:id', component: FavoriteListComponent },
  { path: 'update-entrepreneurships/:id', component: EntrepreneurshipsUpdatesComponent },
  {path:'donations/:id',component:DonationPageComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
