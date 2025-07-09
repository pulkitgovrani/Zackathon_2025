import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, Document, Binder } from '../api.service';

@Component({
  selector: 'app-binder-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './binder-detail.component.html',
  styleUrls: ['./binder-detail.component.scss']
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

  fetchBinderDetails(id: number) {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      binder: this.apiService.getBinderById(id),
      documents: this.apiService.getDocumentsByBinderId(id),
      subBinders: this.apiService.getBinders(id) // Fetch sub-binders
    }).subscribe({
      next: (response) => {
        this.binder = response.binder;
        this.documents = response.documents;
        this.subBinders = response.subBinders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching binder details:', err);
        this.error = `Could not load details for binder with ID ${id}.`;
        this.isLoading = false;
      }
    });
  }

  createSubBinder() {
    if (this.binder) {
      this.router.navigate(['/binders/new'], { queryParams: { parentId: this.binder.id } });
    }
  }
}