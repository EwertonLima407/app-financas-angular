import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SharedSpace, SpaceMember } from '../models/space.models';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3333/api/spaces';

  // Signals
  spaces = signal<SharedSpace[]>([]);
  // null = Modo Particular (Privado), objeto = Espaço Compartilhado ativo
  activeSpace = signal<SharedSpace | null>(null);

  loadSpaces(): Observable<SharedSpace[]> {
    return this.http.get<SharedSpace[]>(this.apiUrl).pipe(
      tap(list => this.spaces.set(list))
    );
  }

  setActiveSpace(space: SharedSpace | null): void {
    this.activeSpace.set(space);
  }

  createSpace(data: { name: string; description?: string }): Observable<SharedSpace> {
    return this.http.post<SharedSpace>(this.apiUrl, data).pipe(
      tap(created => {
        this.spaces.update(current => [...current, created]);
        this.activeSpace.set(created);
      })
    );
  }

  getMembers(spaceId: string): Observable<SpaceMember[]> {
    return this.http.get<SpaceMember[]>(`${this.apiUrl}/${spaceId}/members`);
  }

  addMember(spaceId: string, data: { user_id: string; role: 'GESTOR' | 'VISUALIZADOR' }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${spaceId}/members`, data);
  }
}
