
import { UserFormComponent } from './features/user/components/user-form/user-form.component';
import { UserListComponent } from './features/user/components/user-list/user-list.component';
import { AddressFormComponent } from './features/user/address-form/address-form.component';
import { EntrepreneurshipFormComponent } from './features/entrepreneurship/components/entrepreneurship-form-component/entrepreneurship-form-component.component';
import { EntrepreneurshipDetailComponent } from './features/entrepreneurship/components/entrepreneurship-detail-component/entrepreneurship-detail-component.component';
import { EntrepreneurshipListComponent } from './features/entrepreneurship/components/entrepreneurship-list-component/entrepreneurship-list-component.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/sign-up/sign-up.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AddFavoriteComponent } from './features/favorite-list/components/add-favorite/add-favorite.component';
import { FavoriteListComponent } from './features/favorite-list/components/list-favorite/favorite-list.component';

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
  { path: 'entrepreneurships',
   component: EntrepreneurshipListComponent },
  { path: 'add-entrepreneuship',
   component: EntrepreneurshipFormComponent },
  { path: 'entrepreneurships/:id',
   component: EntrepreneurshipDetailComponent },
    {
      path: 'user-add',
      component:UserFormComponent
    },
    {
      path:'users',
      component:UserListComponent
    },
    { path: 'add-favorite', component: AddFavoriteComponent },
    { path: 'favorites/:id', component: FavoriteListComponent },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },


];
