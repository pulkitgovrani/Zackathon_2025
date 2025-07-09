import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { BindersListComponent } from './binders-list/binders-list.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { BinderDetailComponent } from './binder-detail/binder-detail.component';
import { CreateDocumentComponent } from './create-document/create-document.component'; // New Import
import { CreateBinderComponent } from './create-binder/create-binder.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: 'dashboard', component: DashboardComponent },
  { path: 'documents', component: DocumentsListComponent },
  { path: 'documents/new', component: CreateDocumentComponent }, // New Route
  { path: 'documents/:id', component: DocumentDetailComponent },
  { path: 'binders', component: BindersListComponent },
  { path: 'binders/new', component: CreateBinderComponent },
  { path: 'binders/:id', component: BinderDetailComponent },
];