import { Routes } from "@angular/router";

export const clientRoutes: Routes = [
    {
        path: 'auth', children: [
            { path: 'Login', loadComponent: () => import ('../../auth/views/Login/login').then(m => m.Login) },
            { path: 'Register', loadComponent: () => import('../../auth/views/Registro/registro').then(m => m.Registro) }
        ]
    },
]