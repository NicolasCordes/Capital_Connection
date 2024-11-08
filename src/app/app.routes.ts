import { Routes } from '@angular/router';
import { SignupComponent } from './auth/components/sign-up/sign-up.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UserFormComponent } from './features/user/components/user-form/user-form.component';
import { UserListComponent } from './features/user/components/user-list/user-list.component';
import { AddressFormComponent } from './features/user/address-form/address-form.component';

export const routes: Routes = [
    {
      path: 'sign-in',
      component: SignupComponent
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'home',
      component:HomePageComponent
    },
    {
      path: 'user-add',
      component:UserFormComponent
    },
    {
      path:'users',
      component:UserListComponent
    },
    {
      path:'**',
      redirectTo:'home',
      pathMatch:'full'
    }
];
