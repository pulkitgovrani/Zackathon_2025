import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-binders-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="mb-10">
      <h2 class="text-4xl font-extrabold text-white">All Binders</h2>
      <p class="text-gray-400">This page will list all binders.</p>
    </header>
  `
})
export class BindersListComponent { }