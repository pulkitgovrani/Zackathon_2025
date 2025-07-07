import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="mb-10">
      <h2 class="text-4xl font-extrabold text-white">All Documents</h2>
      <p class="text-gray-400">This page will list all documents.</p>
    </header>
  `
})
export class DocumentsListComponent { }