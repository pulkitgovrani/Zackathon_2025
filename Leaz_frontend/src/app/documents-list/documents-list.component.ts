import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Document, Binder } from '../api.service';
import { Router, RouterLink } from '@angular/router';
import { ActionMenuComponent } from '../shared/action-menu/action-menu.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { MoveItemModalComponent } from '../shared/move-item-modal/move-item-modal.component';
import { forkJoin } from 'rxjs';

/**
 * Component for displaying a list of all documents.
 * It handles fetching the data and managing user actions like delete, move, and copy.
 */
@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ActionMenuComponent, ConfirmationModalComponent, MoveItemModalComponent],
  templateUrl: './documents-list.component.html',
})
export class DocumentsListComponent implements OnInit {
  // Injecting Angular's services for API calls and navigation.
  private apiService = inject(ApiService);
  private router = inject(Router);

  // --- Component State ---
  documents: Document[] = []; // Holds the list of all documents fetched from the API.
  allBinders: Binder[] = []; // Holds the flat list of all binders for name lookups.
  isLoading = true; // Flag to show a loading indicator while data is being fetched.
  error: string | null = null; // Holds any error message if the API call fails.

  // --- Modal State ---
  showDeleteModal = false; // Controls the visibility of the delete confirmation modal.
  showMoveModal = false;   // Controls the visibility of the move item modal.
  selectedDocument: Document | null = null; // The document currently selected for an action.

  /**
   * Angular lifecycle hook that runs when the component is initialized.
   */
  ngOnInit() { this.fetchData(); }

  /**
   * Fetches both documents and the full list of binders in parallel.
   * The binders list is needed to display the name of the binder each document belongs to.
   */
  fetchData() {
    this.isLoading = true;
    this.error = null;
    forkJoin({
      documents: this.apiService.getDocuments(),
      binders: this.apiService.getAllBindersForDropdown()
    }).subscribe({
      next: (response) => {
        this.documents = response.documents.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        this.allBinders = response.binders;
        this.isLoading = false;
      },
      error: (err) => { this.error = 'Could not load data.'; this.isLoading = false; }
    });
  }

  /**
   * A helper method to find a binder's name by its ID.
   * This is used in the template to display the binder name in the table.
   * @param binderId The ID of the binder to look up.
   * @returns The name of the binder, or '—' if the document is not in a binder.
   */
  getBinderName(binderId: number | null): string {
    if (binderId === null) return '—';
    const binder = this.allBinders.find(b => b.id === binderId);
    return binder ? binder.name : 'Unknown';
  }

  // --- Action Handlers from ActionMenuComponent ---

  /** Prepares and shows the delete confirmation modal for a document. */
  onDelete(doc: Document) { this.selectedDocument = doc; this.showDeleteModal = true; }

  /** Prepares and shows the move modal for a document. */
  onMove(doc: Document) { this.selectedDocument = doc; this.showMoveModal = true; }

  /** Updates a document's status to 'Final' and refreshes the list. */
  onMarkAsFinal(doc: Document) { this.apiService.updateDocumentStatus(doc.id, 'Final').subscribe(() => this.fetchData()); }

  /** Copies a document and navigates to the new copy's detail page. */
  onCopy(doc: Document) { 
    this.apiService.copyDocument(doc.id).subscribe((newDoc) => {
      this.router.navigate(['/documents', newDoc.id]);
    });
  }

  // --- Modal Confirmation Handlers ---

  /** Confirms the deletion of the selected document and refreshes the list. */
  confirmDelete() {
    if (!this.selectedDocument) return;
    this.apiService.deleteDocument(this.selectedDocument.id).subscribe(() => {
      this.closeModals();
      this.fetchData();
    });
  }

  /** Confirms moving the selected document to a new binder and refreshes the list. */
  confirmMove(newBinderId: number | null) {
    if (!this.selectedDocument) return;
    this.apiService.updateDocumentBinder(this.selectedDocument.id, newBinderId).subscribe(() => {
      this.closeModals();
      this.fetchData();
    });
  }

  /** Closes all modals and resets the selected document state. */
  closeModals() {
    this.showDeleteModal = false;
    this.showMoveModal = false;
    this.selectedDocument = null;
  }
}