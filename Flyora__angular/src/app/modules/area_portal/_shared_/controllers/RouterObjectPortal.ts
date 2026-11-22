import { Routes } from "@angular/router";

export const portalRoutes: Routes = [
    { path: '', redirectTo: 'Portal', pathMatch: 'full' },
    {
        path: 'Portal', loadComponent: () => import('../views/Layout/layout').then(m => m.Layout), children: [
            
        ]
    }
]