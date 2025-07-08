import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ApiService, Document, Binder } from '../api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  recentDocuments: Document[] = [];
  recentBinders: Binder[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      documents: this.apiService.getDocuments(),
      binders: this.apiService.getBinders()
    }).subscribe({
      next: (response) => {
        this.recentDocuments = response.documents
          .sort((a: Document, b: Document) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
          .slice(0, 10);
        this.recentBinders = response.binders
          .sort((a: Binder, b: Binder) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
          .slice(0, 10);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.error = 'Could not load dashboard data. Please ensure the backend server is running.';
        this.isLoading = false;
      }
    });
  }
}
