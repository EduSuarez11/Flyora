import { Routes } from '@angular/router';
import { clientRoutes } from './modules/area_client/_shared_/controllers/RouterObjectClient';
import { portalRoutes } from './modules/area_portal/_shared_/controllers/RouterObjectPortal';

export const routes: Routes = [...clientRoutes, ...portalRoutes];
