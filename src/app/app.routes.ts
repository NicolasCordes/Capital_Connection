import { Routes } from '@angular/router';
import { SignupComponent } from './auth/components/sign-up/sign-up.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { EntrepreneurshipFormComponent } from './features/entrepreneurship/components/entrepreneurship-form-component/entrepreneurship-form-component.component';
import { EntrepreneurshipDetailComponent } from './features/entrepreneurship/components/entrepreneurship-detail-component/entrepreneurship-detail-component.component';
import { EntrepreneurshipListComponent } from './features/entrepreneurship/components/entrepreneurship-list-component/entrepreneurship-list-component.component';

export const routes: Routes = [
  {
    path: 'sign-in',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  { path: 'entrepreneurships', component: EntrepreneurshipListComponent },
  { path: 'add-entrepreneuship', component: EntrepreneurshipFormComponent },
  { path: 'entrepreneurships/:id', component: EntrepreneurshipDetailComponent },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
