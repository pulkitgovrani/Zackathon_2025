import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { DashboardTreeComponent } from './dashboard-tree/dashboard-tree.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { BindersListComponent } from './binders-list/binders-list.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { BinderDetailComponent } from './binder-detail/binder-detail.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { CreateBinderComponent } from './create-binder/create-binder.component';
import { routes } from './app.routes';
import { DashboardVisualTreeComponent } from './dashboard-visual-tree/dashboard-visual-tree.component';
import { VisualTreeNodeComponent } from './dashboard-visual-tree/visual-tree-node.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardTreeComponent,
    DocumentsListComponent,
    BindersListComponent,
    DocumentDetailComponent,
    BinderDetailComponent,
    CreateDocumentComponent,
    CreateBinderComponent,
    DashboardVisualTreeComponent,
    VisualTreeNodeComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
