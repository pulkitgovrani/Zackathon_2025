import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Binder, NewDocument } from '../api.service';

/**
 * A helper interface for the hierarchical binder dropdown.
 */
interface HierarchicalBinder {
  id: number;
  displayName: string;
}

/**
 * Component for the "Create New Document" form page.
 */
@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-document.component.html',
})
export class CreateDocumentComponent implements OnInit {
  // Injecting Angular's services.
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // --- Component State ---
  documentForm: FormGroup; // The reactive form group for the document details.
  hierarchicalBinders: HierarchicalBinder[] = []; // The formatted list of binders for the dropdown.
  isSaving = false; // Flag to show a "Saving..." state on the submit button.
  error: string | null = null; // Holds any error messages from the API.

  constructor() {
    // Initialize the form with controls and validators.
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      binderId: [null] // Default to no binder selected.
    });
  }

  ngOnInit() {
    this.loadBinders();
  }

  /**
   * Fetches the flat list of all binders and processes it into a hierarchical
   * list for the dropdown menu.
   */
  loadBinders() {
    this.apiService.getAllBindersForDropdown().subscribe(data => {
      this.hierarchicalBinders = this.buildHierarchy(data);
    });
  }

  /**
   * Transforms a flat list of binders into a hierarchical list with display names
   * like "Parent / Child / Grandchild".
   * @param binders The flat list of binders from the API.
   * @returns A sorted list of binders formatted for the dropdown.
   */
  private buildHierarchy(binders: Binder[]): HierarchicalBinder[] {
    const binderMap = new Map<number, Binder>(binders.map(b => [b.id, b]));
    const result: HierarchicalBinder[] = [];

    function getPath(binderId: number | null): string {
      if (binderId === null) return '';
      const binder = binderMap.get(binderId);
      if (!binder) return '';
      const parentPath = getPath(binder.parentId);
      return parentPath ? `${parentPath} / ${binder.name}` : binder.name;
    }

    binders.forEach(binder => {
      result.push({
        id: binder.id,
        displayName: getPath(binder.id)
      });
    });

    return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  /**
   * Handles the form submission. If the form is valid, it sends the new document
   * data to the backend API.
   */
  onSubmit() {
    if (this.documentForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.error = null;

    const formValue = this.documentForm.value;
    const newDocument: NewDocument = {
      title: formValue.title,
      content: '<p>Start writing your document here...</p>', // Default content
      binderId: formValue.binderId ? Number(formValue.binderId) : null
    };

    this.apiService.createDocument(newDocument).subscribe({
      next: (createdDoc) => {
        this.isSaving = false;
        // On success, navigate to the detail page of the newly created document.
        this.router.navigate(['/documents', createdDoc.id]);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating document:', err);
        // Specifically handle the 409 Conflict error for duplicate names.
        if (err.status === 409) {
          this.error = err.error;
        } else {
          this.error = 'Failed to create document. Please try again.';
        }
        this.isSaving = false;
      }
    });
  }
}