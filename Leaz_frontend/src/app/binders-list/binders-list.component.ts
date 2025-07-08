import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Binder } from '../api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-binders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './binders-list.component.html',
  styleUrls: ['./binders-list.component.scss']
})
export class BindersListComponent implements OnInit {
  private apiService = inject(ApiService);

  binders: Binder[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.fetchBinders();
  }

  fetchBinders() {
    this.isLoading = true;
    this.error = null;
    this.apiService.getBinders().subscribe({
      next: (data) => {
        this.binders = data.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching binders:', err);
        this.error = 'Could not load binders. Please ensure the backend server is running.';
        this.isLoading = false;
      }
    });
  }
}