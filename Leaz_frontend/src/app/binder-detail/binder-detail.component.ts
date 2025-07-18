import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, Document, Binder } from '../api.service';
import { ActionMenuComponent } from '../shared/action-menu/action-menu.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { MoveItemModalComponent } from '../shared/move-item-modal/move-item-modal.component';

/**
 * Component for displaying the contents of a single binder,
 * including its sub-binders and documents.
 */
@Component({
  selector: 'app-binder-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ActionMenuComponent, ConfirmationModalComponent, MoveItemModalComponent],
  templateUrl: './binder-detail.component.html',
})
export class BinderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  binder: Binder | null = null;
  documents: Document[] = [];
  subBinders: Binder[] = [];
  isLoading = true;
  error: string | null = null;

  showDeleteModal = false;
  showMoveModal = false;
  selectedItem: Document | Binder | null = null;
  selectedItemType: 'document' | 'binder' = 'document';
  
  modalCurrentItemId: number | null = null;
  modalCurrentParentId: number | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const binderId = Number(params.get('id'));
      if (binderId) {
        this.fetchBinderDetails(binderId);
      } else {
        this.isLoading = false;
        this.error = "No binder ID provided.";
      }
    });
  }

  /**
   * Fetches all data for the binder detail view in parallel.
   * @param id The ID of the binder to display.
   */
  fetchBinderDetails(id: number) {
    this.isLoading = true;
    this.error = null;
    forkJoin({
      binder: this.apiService.getBinderById(id),
      documents: this.apiService.getDocumentsByBinderId(id),
      subBinders: this.apiService.getBinders(id)
    }).subscribe({
      next: (response) => {
        this.binder = response.binder;
        this.documents = response.documents;
        this.subBinders = response.subBinders;
        this.isLoading = false;
      },
      error: (err) => { this.error = `Could not load details for binder with ID ${id}.`; this.isLoading = false; }
    });
  }

  onDelete(item: Document | Binder, type: 'document' | 'binder') {
    this.selectedItem = item;
    this.selectedItemType = type;
    this.showDeleteModal = true;
  }

  onMove(item: Document | Binder, type: 'document' | 'binder') {
    this.selectedItem = item;
    this.selectedItemType = type;
    this.modalCurrentItemId = item.id;
    this.modalCurrentParentId = type === 'document' ? (item as Document).binderId : (item as Binder).parentId;
    this.showMoveModal = true;
  }

  onMarkAsFinal(doc: Document) {
    this.apiService.updateDocumentStatus(doc.id, 'Final').subscribe(() => this.fetchBinderDetails(this.binder!.id));
  }
  
  onCopy(doc: Document) {
    this.apiService.copyDocument(doc.id).subscribe(() => this.fetchBinderDetails(this.binder!.id));
  }

  confirmDelete() {
    if (!this.selectedItem) return;
    const deleteObs = this.selectedItemType === 'document' 
      ? this.apiService.deleteDocument(this.selectedItem.id)
      : this.apiService.deleteBinder(this.selectedItem.id);

    deleteObs.subscribe(() => {
      this.closeModals();
      this.fetchBinderDetails(this.binder!.id);
    });
  }

  confirmMove(newParentId: number | null) {
    if (!this.selectedItem) return;
    
    if (this.selectedItemType === 'document') {
      this.apiService.updateDocumentBinder(this.selectedItem.id, newParentId).subscribe(() => {
        this.closeModals();
        this.fetchBinderDetails(this.binder!.id);
      });
    } else { // It's a binder
      this.apiService.updateBinderParent(this.selectedItem.id, newParentId).subscribe(() => {
        this.closeModals();
        this.fetchBinderDetails(this.binder!.id);
      });
    }
  }

  closeModals() {
    this.showDeleteModal = false;
    this.showMoveModal = false;
    this.selectedItem = null;
    this.modalCurrentItemId = null;
    this.modalCurrentParentId = null;
  }

  /** Navigates to the page for creating a new sub-binder within the current binder. */
  createSubBinder() {
    if (this.binder) {
      this.router.navigate(['/binders/new'], { queryParams: { parentId: this.binder.id } });
    }
  }
}
