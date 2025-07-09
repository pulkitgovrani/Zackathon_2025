import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Binder, NewDocument } from '../api.service';

interface HierarchicalBinder {
  id: number;
  displayName: string;
}

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss']
})
export class CreateDocumentComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  documentForm: FormGroup;
  hierarchicalBinders: HierarchicalBinder[] = [];
  isSaving = false;
  error: string | null = null;

  constructor() {
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      binderId: [null]
    });
  }

  ngOnInit() {
    this.loadBinders();
  }

  loadBinders() {
    this.apiService.getAllBindersForDropdown().subscribe(data => {
      this.hierarchicalBinders = this.buildHierarchy(data);
    });
  }

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

  onSubmit() {
    if (this.documentForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.error = null;

    const formValue = this.documentForm.value;
    const newDocument: NewDocument = {
      title: formValue.title,
      content: '<p>Start writing your document here...</p>',
      binderId: formValue.binderId ? Number(formValue.binderId) : null
    };

    this.apiService.createDocument(newDocument).subscribe({
      next: (createdDoc) => {
        this.isSaving = false;
        this.router.navigate(['/documents', createdDoc.id]);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating document:', err);
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