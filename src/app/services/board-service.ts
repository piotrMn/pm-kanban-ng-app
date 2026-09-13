import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../model/board';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiConstants } from '../api-constants';
import { CreateBoardRequest } from '../model/create-board-request';

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  private allBoardsSubject: BehaviorSubject<Board[] | null> = new BehaviorSubject<Board[] | null>(null)

  constructor(private http: HttpClient){}

  public allBoardsObs(): Observable<Board[] | null> {
    if (this.allBoardsSubject.value == null) {
      this.getAllBoards().subscribe()
    }
    return this.allBoardsSubject.asObservable()
  }

  private getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${ApiConstants.BASE_URL}/boards`).pipe(
      tap((boards => this.allBoardsSubject.next(boards)))
    );
  }

  getTeamBoards(teamId: string): Observable<Board[]> {
    return this.http.get<Board[]>(`${ApiConstants.BASE_URL}/boards/${teamId}`)
  }

  postCreateBoardRequest(request: CreateBoardRequest): Observable<string> {
    return this.http.post<string>(`${ApiConstants.BASE_URL}/boards`, request).pipe(
      tap(() => this.getAllBoards().subscribe())
    )
  }
  
}
