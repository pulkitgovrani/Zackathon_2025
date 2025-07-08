import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Document } from '../api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // FIX: Added RouterLink here
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss']
})
export class DocumentsListComponent implements OnInit {
  private apiService = inject(ApiService);

  documents: Document[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.isLoading = true;
    this.error = null;
    this.apiService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.error = 'Could not load documents. Please ensure the backend server is running.';
        this.isLoading = false;
      }
    });
  }
}