import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Item } from '../model/item'; 
import { Observable } from 'rxjs';
import { ApiConstants } from '../api-constants';
import { CreateItemRequest } from '../model/create-item-request';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  private boardItemsSubject: BehaviorSubject<Item[] | null> = new BehaviorSubject<Item[] | null>(null)

  constructor(private http: HttpClient){}

  
  public allBoardItemsObs(boardId: string): Observable<Item[] | null> {
    if (this.boardItemsSubject.value === null) {
      this.getAllBoardItems(boardId).subscribe()
    }
    return this.boardItemsSubject.asObservable()
  }

  private getAllBoardItems(boardId: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${ApiConstants.BASE_URL}/items?boardId=${boardId}`).pipe(
      tap((items => this.boardItemsSubject.next(items)))
    );
  }

  public updateItemState(itemId: string, newState: string, boardId: string): Observable<string> {
    let body: any = {}
    body.state = newState
    return this.http.post<string>(`${ApiConstants.BASE_URL}/items/${itemId}/state`, body).pipe(
      tap(() => this.getAllBoardItems(boardId).subscribe())
    )
  }

  public updateItemAssignedTo(itemId: string, assignedToId: string, boardId: string): Observable<string> {
    let body: any = {}
    body.assignedTo = assignedToId
    return this.http.post<string>(`${ApiConstants.BASE_URL}/items/${itemId}/assign`, body).pipe(
      tap(() => this.getAllBoardItems(boardId).subscribe())
    )
  }

  public updateItemEstimation(itemId: string, newEstimation: number, boardId: string): Observable<string> {
    let body: any = {}
    body.estimation = newEstimation
    return this.http.post<string>(`${ApiConstants.BASE_URL}/items/${itemId}/estimation`, body).pipe(
      tap(() => this.getAllBoardItems(boardId).subscribe())
    )
  }

  public saveItem(request: CreateItemRequest): Observable<string> {
    return this.http.post<string>(`${ApiConstants.BASE_URL}/items`, request).pipe(
      tap(() => this.getAllBoardItems(request.boardId).subscribe())
    )
  }

  public deleteItem(itemId: string, boardId: string): Observable<string> {
    return this.http.delete<string>(`${ApiConstants.BASE_URL}/items/${itemId}`).pipe(
      tap(() => this.getAllBoardItems(boardId).subscribe())
    )
  }

}
