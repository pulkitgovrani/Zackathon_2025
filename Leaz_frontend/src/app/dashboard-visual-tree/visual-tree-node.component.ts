import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Add this
import { BinderTreeNode } from '../binder-tree-node.model';

@Component({
  selector: 'app-visual-tree-node',
  standalone: true,
  imports: [CommonModule], // <-- Add this
  template: `
    <div class="tree-node-container">
      <div
        class="tree-box"
        [ngClass]="{
          binder: !isSubBinder(node),
          subbinder: isSubBinder(node)
        }"
      >
        {{ node.name }}
      </div>
      <svg *ngIf="hasChildren()" [attr.width]="getSvgWidth()" height="40" style="display: block;">
        <line
          [attr.x1]="getSvgWidth()/2"
          y1="0"
          [attr.x2]="getChildX(childIdx)"
          y2="40"
          stroke="#222"
          stroke-width="2"
          *ngFor="let child of getAllChildren(); let childIdx = index"
        />
      </svg>
      <div class="tree-children" *ngIf="hasChildren()">
        <ng-container *ngFor="let child of node.children">
          <app-visual-tree-node [node]="child"></app-visual-tree-node>
        </ng-container>
        <div
          *ngFor="let doc of node.documents"
          class="tree-box doc"
        >
          {{ doc.title }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tree-node-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 120px;
      position: relative;
    }
    .tree-box {
      min-width: 110px;
      min-height: 48px;
      background: #ffb86c;
      color: #222;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 1.05em;
      margin-bottom: 0.5rem;
      box-shadow: 0 2px 8px #0001;
      border: 1.5px solid #ffb86c;
      transition: box-shadow 0.2s;
    }
    .tree-box.subbinder {
      background: #ffe066;
      border-color: #ffe066;
    }
    .tree-box.doc {
      background: #a5a6fa;
      border-color: #a5a6fa;
      color: #222;
      margin: 0 0.5rem;
      min-width: 100px;
      min-height: 40px;
      font-size: 0.98em;
    }
    .tree-children {
      display: flex;
      gap: 2rem;
      margin-top: 0.5rem;
    }
  `]
})
export class VisualTreeNodeComponent {
  @Input() node!: BinderTreeNode;

  isSubBinder(node: BinderTreeNode): boolean {
    // You can adjust this logic if you have a better way to detect sub-binders
    return !!node.parentId || (node.children.length > 0 && node.name.toLowerCase().includes('sub'));
  }

  hasChildren(): boolean {
    return this.node.children.length > 0 || this.node.documents.length > 0;
  }

  getAllChildren(): any[] {
    return [...this.node.children, ...this.node.documents];
  }

  getSvgWidth(): number {
    // 120px per child, min 120
    return Math.max(120, this.getAllChildren().length * 120);
  }

  getChildX(idx: number): number {
    // Spread children evenly
    const total = this.getAllChildren().length;
    return (this.getSvgWidth() / (total + 1)) * (idx + 1);
  }
}