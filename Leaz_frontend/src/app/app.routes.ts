import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { BindersListComponent } from './binders-list/binders-list.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: 'dashboard', component: DashboardComponent },
  { path: 'documents', component: DocumentsListComponent },
  { path: 'binders', component: BindersListComponent },
  // Add routes for document/binder details later
  { path: 'documents/:id', component: DocumentDetailComponent},
  // { path: 'binders/:id', component: BinderDetailComponent },
];