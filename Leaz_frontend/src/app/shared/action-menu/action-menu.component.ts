import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * A reusable dropdown menu component for performing actions on an item (document or binder).
 */
@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-menu.component.html',
})
export class ActionMenuComponent {
  // Inputs to receive data from the parent component.
  @Input() itemType: 'document' | 'binder' = 'document';
  @Input() item: any;

  // Outputs to emit events back to the parent component when an action is clicked.
  @Output() delete = new EventEmitter<void>();
  @Output() move = new EventEmitter<void>();
  @Output() copy = new EventEmitter<void>();
  @Output() markAsFinal = new EventEmitter<void>();

  isOpen = false;

  // Closes the menu if the user clicks anywhere else on the page.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) { this.isOpen = false; }

  /** Toggles the visibility of the dropdown menu. */
  toggleMenu(event: MouseEvent) {
    event.stopPropagation(); // Prevents the document click listener from immediately closing the menu.
    this.isOpen = !this.isOpen;
  }
}