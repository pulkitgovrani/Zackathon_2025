import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}

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

  getBinders(): Observable<Binder[]> {
    return this.http.get<Binder[]>(this.bindersUrl);
  }

   updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.documentsUrl}/${id}`, document);
  }
}