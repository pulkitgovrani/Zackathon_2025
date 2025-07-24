import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Add this
import { BinderTreeNode } from '../binder-tree-node.model';
import { VisualTreeNodeComponent } from './visual-tree-node.component';
import { Document as AppDocument } from '../api.service';

@Component({
  selector: 'app-dashboard-visual-tree',
  standalone: true,
  imports: [CommonModule, VisualTreeNodeComponent], // <-- Add CommonModule here
  template: `
    <div class="visual-tree-root">
      <ng-container *ngFor="let root of binderTrees">
        <app-visual-tree-node [node]="root"></app-visual-tree-node>
      </ng-container>
    </div>
  `,
  styles: [`
    .visual-tree-root {
      display: flex;
      gap: 4rem;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;
      min-height: 400px;
      padding: 2rem 0;
      overflow-x: auto;
    }
  `]
})
export class DashboardVisualTreeComponent {
  @Input() binderTrees: BinderTreeNode[] = [];
  @Input() unassignedDocuments: AppDocument[] = [];
}