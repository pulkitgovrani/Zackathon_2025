import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ApiService, Binder, Document } from '../api.service';

interface BinderTreeNode {
  id: number;
  name: string;
  children: BinderTreeNode[];
  documents: Document[];
  collapsed: boolean;
}

@Component({
  selector: 'app-dashboard-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './dashboard-tree.component.html',
  styleUrls: ['./dashboard-tree.component.scss'],
})
export class DashboardTreeComponent implements OnInit {
  loading = true;
  searchTerm = '';
  filteredBinderTrees: BinderTreeNode[] = [];
  allDropListIds: string[] = [];

  private allBinders: Binder[] = [];
  private allDocuments: Document[] = [];
  private binderTrees: BinderTreeNode[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    Promise.all([
      this.apiService.getAllBindersForDropdown().toPromise(),
      this.apiService.getDocuments().toPromise(),
    ]).then(([binders, documents]) => {
      this.allBinders = binders || [];
      this.allDocuments = documents || [];
      this.binderTrees = this.buildBinderTrees();
      this.filteredBinderTrees = this.binderTrees;
      this.allDropListIds = this.collectDropListIds(this.binderTrees);
      this.allDropListIds.push('dropList-unassigned'); // <-- Add this line!
      this.loading = false;
    });
  }

  buildBinderTrees(): BinderTreeNode[] {
    const idToNode = new Map<number, BinderTreeNode>();
    this.allBinders.forEach((binder) => {
      idToNode.set(binder.id, {
        id: binder.id,
        name: binder.name,
        children: [],
        documents: [],
        collapsed: true, // default collapsed
      });
    });
    // Assign children
    this.allBinders.forEach((binder) => {
      if (binder.parentId !== null && idToNode.has(binder.parentId)) {
        idToNode.get(binder.parentId)!.children.push(idToNode.get(binder.id)!);
      }
    });
    // Assign documents
    this.allDocuments.forEach((doc) => {
      if (doc.binderId !== null && idToNode.has(doc.binderId)) {
        idToNode.get(doc.binderId)!.documents.push(doc);
      }
    });
    // Return root binders
    return this.allBinders
      .filter((binder) => binder.parentId === null)
      .map((binder) => idToNode.get(binder.id)!);
  }

  collectDropListIds(nodes: BinderTreeNode[]): string[] {
    let ids: string[] = [];
    for (const node of nodes) {
      ids.push('dropList-label-' + node.id);
      ids.push('dropList-' + node.id);
      ids = ids.concat(this.collectDropListIds(node.children));
    }
    return ids;
  }

  toggleCollapse(node: BinderTreeNode) {
    node.collapsed = !node.collapsed;
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    if (!term) {
      this.filteredBinderTrees = this.binderTrees;
      return;
    }
    // Simple filter: show binders whose name matches, and their parents
    const filterNodes = (nodes: BinderTreeNode[]): BinderTreeNode[] => {
      return nodes
        .map((node) => {
          const children = filterNodes(node.children);
          if (
            node.name.toLowerCase().includes(term.toLowerCase()) ||
            children.length > 0
          ) {
            return {
              ...node,
              children,
              collapsed: false,
            };
          }
          return null;
        })
        .filter(Boolean) as BinderTreeNode[];
    };
    this.filteredBinderTrees = filterNodes(this.binderTrees);
  }

  onDocumentDrop(event: CdkDragDrop<Document[]>, targetBinder: BinderTreeNode | null) {
    const doc: Document = event.item.data;
    // Remove from old binder
    for (const node of this.binderTrees) {
      this.removeDocFromNode(node, doc.id);
    }
    // If dropped in unassigned, set binderId to null
    if (!targetBinder) {
      doc.binderId = null;
      this.apiService.updateDocumentBinder(doc.id, null).subscribe();
      return;
    }
    // Otherwise, add to binder
    targetBinder.collapsed = false;
    targetBinder.documents.push(doc);
    doc.binderId = targetBinder.id;
    this.apiService.updateDocumentBinder(doc.id, targetBinder.id).subscribe();
  }

  removeDocFromNode(node: BinderTreeNode, docId: number): boolean {
    const idx = node.documents.findIndex((d) => d.id === docId);
    if (idx !== -1) {
      node.documents.splice(idx, 1);
      return true;
    }
    for (const child of node.children) {
      if (this.removeDocFromNode(child, docId)) return true;
    }
    return false;
  }

  onDropListEntered(node: BinderTreeNode) {
    node.collapsed = false;
  }

  get unassignedDocuments(): Document[] {
    return this.allDocuments.filter(doc => doc.binderId == null);
  }

  setInputBorder(input: HTMLInputElement, color: string) {
    input.style.borderColor = color;
  }
}

