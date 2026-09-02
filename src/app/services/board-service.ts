import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../model/board';
import { Observable } from 'rxjs';
import { ApiConstants } from '../api-constants';

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  constructor(private http: HttpClient){}

  getTeamBoards(teamId: string): Observable<Board[]> {
    return this.http.get<Board[]>(`${ApiConstants.BASE_URL}/boards/${teamId}`)
  }
  
}
