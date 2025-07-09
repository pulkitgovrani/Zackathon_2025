import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Data Interfaces ---
export interface Document {
  id: number;
  title: string;
  content: string;
  version: number;
  status: string;
  dateCreated: string;
  lastModified: string;
  binderId: number | null;
}

export interface Binder {
  id: number;
  name: string;
  dateCreated: string;
  parentId: number | null;
}

export type NewDocument = Omit<Document, 'id' | 'version' | 'status' | 'dateCreated' | 'lastModified'>;
export type NewBinder = Omit<Binder, 'id' | 'dateCreated'>;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  private documentsUrl = 'http://localhost:8080/documents';
  private bindersUrl = 'http://localhost:8080/binders';

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.documentsUrl);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.documentsUrl}/${id}`);
  }

  updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.documentsUrl}/${id}`, document);
  }

  createDocument(document: NewDocument): Observable<Document> {
    return this.http.post<Document>(this.documentsUrl, document);
  }

  getBinders(parentId?: number): Observable<Binder[]> {
    let params = new HttpParams();
    if (parentId) {
      params = params.append('parentId', parentId.toString());
    }
    return this.http.get<Binder[]>(this.bindersUrl, { params });
  }
  
  getAllBindersForDropdown(): Observable<Binder[]> {
    return this.http.get<Binder[]>(`${this.bindersUrl}/all`);
  }

  getBinderById(id: number): Observable<Binder> {
    return this.http.get<Binder>(`${this.bindersUrl}/${id}`);
  }

  getDocumentsByBinderId(binderId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.bindersUrl}/${binderId}/documents`);
  }

  createBinder(binder: NewBinder): Observable<Binder> {
    return this.http.post<Binder>(this.bindersUrl, binder);
  }
}