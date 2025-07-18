import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Binder } from '../../api.service';

/**
 * A reusable modal for moving a document or binder to a new location.
 */
@Component({
  selector: 'app-move-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './move-item-modal.component.html',
})
export class MoveItemModalComponent implements OnInit {
  @Input() itemType: 'document' | 'binder' = 'document';
  @Input() currentItemId!: number;
  @Input() currentParentId: number | null = null;
  @Output() move = new EventEmitter<number | null>();
  @Output() cancel = new EventEmitter<void>();

  private apiService = inject(ApiService);
  allBinders: Binder[] = [];
  filteredBinders: Binder[] = [];
  selectedBinderId: number | null = null;

  ngOnInit() {
    this.apiService.getAllBindersForDropdown().subscribe(data => {
      this.allBinders = data;
      this.filterBinderOptions();
    });
  }

  /**
   * Filters the list of binders to show only valid move locations.
   */
  filterBinderOptions() {
    if (this.itemType === 'document') {
      // A document can be moved to any binder except the one it's already in.
      this.filteredBinders = this.allBinders.filter(b => b.id !== this.currentParentId);
    } else { // It's a binder
      // A binder cannot be moved into itself or one of its own children.
      const descendantIds = this.getDescendantIds(this.currentItemId);
      this.filteredBinders = this.allBinders.filter(b => 
        b.id !== this.currentItemId && 
        !descendantIds.has(b.id)
      );
    }
  }

  /**
   * Recursively finds all descendant binder IDs for a given binder.
   * @param binderId The ID of the binder to start from.
   * @returns A Set containing the IDs of all descendant binders.
   */
  private getDescendantIds(binderId: number): Set<number> {
    const descendants = new Set<number>();
    const queue = [binderId];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = this.allBinders.filter(b => b.parentId === currentId);
      for (const child of children) {
        descendants.add(child.id);
        queue.push(child.id);
      }
    }
    return descendants;
  }
}