import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
    {
        path:'masters',
        canActivate: [authGuard],
        children: [
            { path: 'category', loadComponent: () => import('./component/category-list/category-list.component').then(m => m.CategoryListComponent)},
            { path: 'itemmaster', loadComponent: () => import('./component/item-list/item-list.component').then(m => m.ItemListComponent)},
            { path: 'customer', loadComponent: () => import('./component/customer-list/customer-list.component').then(m => m.CustomerListComponent)}
        ]
    },
    {
        path: 'exit',
        canActivate:[authGuard],
        children:[
            { path:'logout', loadComponent:() => import('./pages/logout/logout.component').then(m=>m.LogoutComponent)}
        ]
    },
    { path: '**', redirectTo: 'home'}
];
