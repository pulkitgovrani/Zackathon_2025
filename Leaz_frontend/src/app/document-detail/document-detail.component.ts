import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Document } from '../api.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FormsModule } from '@angular/forms';

/**
 * Component for viewing and editing a single document.
 */
@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FroalaEditorModule, FroalaViewModule, FormsModule],
  templateUrl: './document-detail.component.html',
})
export class DocumentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  document: Document | null = null;
  isLoading = true;
  error: string | null = null;
  isSaving = false;
  saveSuccess = false;
  isEditingTitle = false;
  
  availableStatuses = ['Draft', 'In Review', 'Final', 'Archived'];

  public editorOptions: Object = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: true,
    toolbarInline: false
  }

  ngOnInit() {
    // Subscribe to route parameter changes to handle navigation between documents.
    this.route.paramMap.subscribe(params => {
        const documentId = Number(params.get('id'));
        if (documentId) {
          this.fetchDocument(documentId);
        } else {
          this.isLoading = false;
          this.error = "No document ID provided.";
        }
    });
  }

  /** Fetches the document data from the API based on the ID from the URL. */
  fetchDocument(id: number) {
    this.isLoading = true;
    this.error = null;
    this.apiService.getDocumentById(id).subscribe({
      next: (data) => {
        this.document = data;
        this.isLoading = false;
      },
      error: (err) => { this.error = `Could not load document with ID ${id}.`; this.isLoading = false; }
    });
  }

  /** Saves all changes (title, content, status) to the document. */
  saveChanges() {
    if (!this.document) return;
    this.isSaving = true;
    this.saveSuccess = false;
    this.error = null;
    this.isEditingTitle = false; // Exit title editing mode on save

    this.apiService.updateDocument(this.document.id, this.document).subscribe({
      next: (updatedDocument) => {
        this.document = updatedDocument;
        this.isSaving = false;
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 3000); // Hide success message after 3 seconds
      },
      error: (err) => { this.error = 'Failed to save changes. Please try again.'; this.isSaving = false; }
    });
  }

  /** Creates a copy of the current document and navigates to the new copy. */
  copyDocument() {
    if (!this.document) return;
    this.apiService.copyDocument(this.document.id).subscribe((newDoc) => {
      this.router.navigate(['/documents', newDoc.id]);
    });
  }
}