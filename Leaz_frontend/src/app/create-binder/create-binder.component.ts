import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, NewBinder } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-binder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-binder.component.html',
  styleUrls: ['./create-binder.component.scss']
})
export class CreateBinderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  binderForm: FormGroup;
  isSaving = false;
  error: string | null = null;
  parentId: number | null = null;

  constructor() {
    this.binderForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('parentId');
      this.parentId = id ? Number(id) : null;
    });
  }

  onSubmit() {
    if (this.binderForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.error = null;

    const newBinder: NewBinder = {
      name: this.binderForm.value.name,
      parentId: this.parentId
    };

    this.apiService.createBinder(newBinder).subscribe({
      next: (createdBinder) => {
        this.isSaving = false;
        const navTarget = this.parentId ? ['/binders', this.parentId] : ['/binders'];
        this.router.navigate(navTarget);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating binder:', err);
        if (err.status === 409) {
          this.error = err.error;
        } else {
          this.error = 'Failed to create binder. Please try again.';
        }
        this.isSaving = false;
      }
    });
  }
}