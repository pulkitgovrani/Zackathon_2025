import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Binder } from '../api.service';
import { Router, RouterLink } from '@angular/router';
import { ActionMenuComponent } from '../shared/action-menu/action-menu.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { MoveItemModalComponent } from '../shared/move-item-modal/move-item-modal.component';

/**
 * Component for displaying a list of all top-level binders.
 */
@Component({
  selector: 'app-binders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ActionMenuComponent, ConfirmationModalComponent, MoveItemModalComponent],
  templateUrl: './binders-list.component.html',
})
export class BindersListComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  binders: Binder[] = [];
  isLoading = true;
  error: string | null = null;

  showDeleteModal = false;
  showMoveModal = false;
  selectedBinder: Binder | null = null;

  ngOnInit() { this.fetchBinders(); }

  /**
   * Fetches all top-level (root) binders from the API.
   */
  fetchBinders() {
    this.isLoading = true;
    this.apiService.getBinders().subscribe({
      next: (data) => {
        this.binders = data.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        this.isLoading = false;
      },
      error: (err) => { this.error = 'Could not load binders.'; this.isLoading = false; }
    });
  }

  /** Navigates to the page for creating a new top-level binder. */
  createBinder() { this.router.navigate(['/binders/new']); }

  onDelete(binder: Binder) { this.selectedBinder = binder; this.showDeleteModal = true; }
  onMove(binder: Binder) { this.selectedBinder = binder; this.showMoveModal = true; }

  confirmDelete() {
    if (!this.selectedBinder) return;
    this.apiService.deleteBinder(this.selectedBinder.id).subscribe(() => {
      this.closeModals();
      this.fetchBinders();
    });
  }

  confirmMove(newParentId: number | null) {
    if (!this.selectedBinder) return;
    this.apiService.updateBinderParent(this.selectedBinder.id, newParentId).subscribe(() => {
      this.closeModals();
      this.fetchBinders();
    });
  }

  closeModals() {
    this.showDeleteModal = false;
    this.showMoveModal = false;
    this.selectedBinder = null;
  }
}