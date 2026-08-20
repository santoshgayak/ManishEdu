import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Orders } from './pages/order/order';
import { MainDashboard } from './pages/main-dashboard/main-dashboard';
import { Classes } from './pages/classes/classes';
import { Products } from './pages/products/products';
import { EditClass } from './pages/edit-class/edit-class';
import { AddClass } from './pages/add-class/add-class';
import { UpadateSuccess } from './pages/upadate-success/upadate-success';
import { AddProduct } from './pages/add-product/add-product';
import { EditProduct } from './pages/edit-product/edit-product';
import { UpdateSuccessProduct } from './pages/update-success-product/update-success-product';
import { authGuard } from './auth-guard';
import { SignIn } from './pages/sign-in/sign-in';
import { Profile } from './pages/profile/profile';
import { Loader } from './components/loader/loader';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'loader',
    component: Loader,
  },
  {
    path: '',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    canActivateChild: [authGuard],

    children: [
      { path: '', redirectTo: 'main-dashboard', pathMatch: 'full' },
      { path: 'order', component: Orders },
      { path: 'profile', component: Profile },
      { path: 'main-dashboard', component: MainDashboard },
      { path: 'classes', component: Classes },
      { path: 'products', component: Products },
      { path: 'edit-class/:classId', component: EditClass },
      { path: 'edit-product/:productId', component: EditProduct },
      { path: 'add-class', component: AddClass },
      { path: 'add-product', component: AddProduct },
      { path: 'update-success/:classId', component: UpadateSuccess },
      { path: 'update-success-product/:productId', component: UpdateSuccessProduct },
    ],
  },
];
