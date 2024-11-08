import { Routes } from '@angular/router';
import { SignupComponent } from './auth/components/sign-up/sign-up.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

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
      path:'**',
      redirectTo:'home',
      pathMatch:'full'
    }
];
