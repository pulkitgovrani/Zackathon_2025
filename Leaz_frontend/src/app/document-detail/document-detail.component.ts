import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Document } from '../api.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FroalaEditorModule, FroalaViewModule],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  document: Document | null = null;
  isLoading = true;
  error: string | null = null;

  isSaving = false;
  saveSuccess = false;

  // Froala editor options
  public editorOptions: Object = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: true,
    toolbarInline: false,
    theme: 'light',
  }

  ngOnInit() {
    const documentId = Number(this.route.snapshot.paramMap.get('id'));
    if (documentId) {
      this.fetchDocument(documentId);
    } else {
      this.isLoading = false;
      this.error = "No document ID provided.";
    }
  }

  fetchDocument(id: number) {
    this.isLoading = true;
    this.error = null;
    this.apiService.getDocumentById(id).subscribe({
      next: (data) => {
        this.document = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching document:', err);
        this.error = `Could not load document with ID ${id}.`;
        this.isLoading = false;
      }
    });
  }

  saveChanges() {
    if (!this.document) return;

    this.isSaving = true;
    this.saveSuccess = false;
    this.error = null;

    this.apiService.updateDocument(this.document.id, this.document).subscribe({
      next: (updatedDocument) => {
        this.document = updatedDocument;
        this.isSaving = false;
        this.saveSuccess = true;
        // Hide success message after 3 seconds
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: (err) => {
        console.error('Error saving document:', err);
        this.error = 'Failed to save changes. Please try again.';
        this.isSaving = false;
      }
    });
  }
}