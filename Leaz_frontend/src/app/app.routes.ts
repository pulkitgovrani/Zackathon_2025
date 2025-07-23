// --- src/app/app.routes.ts ---
import { Routes } from '@angular/router';
import { DashboardTreeComponent } from './dashboard-tree/dashboard-tree.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { BindersListComponent } from './binders-list/binders-list.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { BinderDetailComponent } from './binder-detail/binder-detail.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { CreateBinderComponent } from './create-binder/create-binder.component';

/**
 * Defines the navigation routes for the application.
 * Each route maps a URL path to a specific component.
 */
export const routes: Routes = [
  // Redirect the root path to the dashboard by default.
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // Main application pages
  { path: 'dashboard', component: DashboardTreeComponent },
  { path: 'documents', component: DocumentsListComponent },
  { path: 'binders', component: BindersListComponent },

  // Creation pages
  { path: 'documents/new', component: CreateDocumentComponent },
  { path: 'binders/new', component: CreateBinderComponent },

  // Detail pages with a dynamic ID parameter in the URL
  { path: 'documents/:id', component: DocumentDetailComponent },
  { path: 'binders/:id', component: BinderDetailComponent },
];
