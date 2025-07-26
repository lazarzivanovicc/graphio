import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./core/login/login')
                .then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./core/register/register')
                .then(m => m.Register)
    },
    {
        path: 'main-section',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/main/main.routes')
                .then(m => m.mainRoutes)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
