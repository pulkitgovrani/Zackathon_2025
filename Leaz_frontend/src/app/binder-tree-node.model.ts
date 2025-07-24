import { Document } from './api.service';

export interface BinderTreeNode {
  id: number;
  name: string;
  children: BinderTreeNode[];
  documents: Document[];
  collapsed: boolean;
  parentId?: number | null; // add if you use it for sub-binder detection
}