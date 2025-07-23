import { ApiService, Binder, Document } from '../api.service';

interface BinderTreeNode extends Binder {
  children: BinderTreeNode[];
  documents: Document[];
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-tree',
  templateUrl: './dashboard-tree.component.html',
  styleUrls: ['./dashboard-tree.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class DashboardTreeComponent implements OnInit {
  headBinders: Binder[] = [];
  binderTrees: BinderTreeNode[] = [];
  filteredBinderTrees: BinderTreeNode[] = [];
  loading = true;
  allDropListIds: string[] = [];
  dropListIdToBinderId: { [dropListId: string]: number } = {};
  searchTerm: string = '';

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.api.getBinders().subscribe(async (binders) => {
      this.headBinders = binders.filter((b) => b.parentId === null);
      this.binderTrees = await Promise.all(
        this.headBinders.map((binder) => this.buildBinderTree(binder.id))
      );
      this.updateAllDropListIds();
      this.applySearch();
      this.loading = false;
    });
  }

  async buildBinderTree(binderId: number): Promise<BinderTreeNode> {
    const binder = await this.api.getBinderById(binderId).toPromise();
    if (!binder) throw new Error('Binder not found');
    const children = (await this.api.getBinders(binderId).toPromise()) || [];
    const documents =
      (await this.api.getDocumentsByBinderId(binderId).toPromise()) || [];
    const childNodes = await Promise.all(
      children.map((child) => this.buildBinderTree(child.id))
    );
    return {
      id: binder.id,
      name: binder.name,
      dateCreated: binder.dateCreated,
      parentId: binder.parentId ?? null,
      children: childNodes,
      documents: documents,
    };
  }

  // Search logic: recursively filter tree, keeping parents of matches
  applySearch() {
    if (!this.searchTerm.trim()) {
      this.filteredBinderTrees = this.binderTrees;
      return;
    }
    const term = this.searchTerm.trim().toLowerCase();
    function filterTree(node: BinderTreeNode): BinderTreeNode | null {
      const nameMatches = node.name.toLowerCase().includes(term);
      if (nameMatches) {
        // If this node matches, show the entire subtree (all children and documents)
        return node;
      }
      // Otherwise, filter children
      const filteredChildren: BinderTreeNode[] = [];
      for (const child of node.children) {
        const filteredChild = filterTree(child);
        if (filteredChild) filteredChildren.push(filteredChild);
      }
      if (filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
          documents: [],
        };
      }
      return null;
    }
    this.filteredBinderTrees = this.binderTrees
      .map(filterTree)
      .filter((n): n is BinderTreeNode => !!n);
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applySearch();
    this.updateAllDropListIds();
  }

  // Helper to collect all drop list ids for cdkDropListConnectedTo
  updateAllDropListIds() {
    const ids: string[] = [];
    const map: { [dropListId: string]: number } = {};
    function collect(node: BinderTreeNode) {
      ids.push('dropList-' + node.id);
      map['dropList-' + node.id] = node.id;
      ids.push('dropList-label-' + node.id);
      map['dropList-label-' + node.id] = node.id;
      node.children.forEach(collect);
    }
    this.binderTrees.forEach(collect);
    this.allDropListIds = ids;
    this.dropListIdToBinderId = map;
  }

  // Drag & drop for documents between any binders
  onDocumentDrop(event: CdkDragDrop<Document[]>, targetBinder: BinderTreeNode) {
    const prevContainer = event.previousContainer;
    const currContainer = event.container;
    const sourceBinderId = this.dropListIdToBinderId[prevContainer.id];
    const destBinderId = this.dropListIdToBinderId[currContainer.id];
    console.log('onDocumentDrop called', { event, targetBinder });
    console.log(
      'prevContainer.id:',
      prevContainer.id,
      'currContainer.id:',
      currContainer.id
    );
    console.log(
      'Source binder id:',
      sourceBinderId,
      'Destination binder id:',
      destBinderId
    );
    if (prevContainer === currContainer) {
      moveItemInArray(
        currContainer.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const doc = prevContainer.data[event.previousIndex];
      console.log(
        'Moving document',
        doc.id,
        'from binder',
        sourceBinderId,
        'to binder',
        destBinderId
      );
      transferArrayItem(
        prevContainer.data,
        currContainer.data,
        event.previousIndex,
        event.currentIndex
      );
      // Call API to update document's binder
      this.api.updateDocumentBinder(doc.id, destBinderId).subscribe({
        next: () => {
          this.snackBar.open('Document moved!', '', { duration: 1500 });
          // Refresh the tree after move
          this.api.getBinders().subscribe(async (binders) => {
            this.headBinders = binders.filter((b) => b.parentId === null);
            this.binderTrees = await Promise.all(
              this.headBinders.map((binder) => this.buildBinderTree(binder.id))
            );
            this.updateAllDropListIds();
          });
        },
        error: () => {
          this.snackBar.open('Failed to move document', '', { duration: 2000 });
        },
      });
    }
  }

  getAllDropListIds(): string[] {
    return this.allDropListIds;
  }
}

