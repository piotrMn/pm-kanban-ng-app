import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Item } from '../model/item'; 
import { Observable } from 'rxjs';
import { ApiConstants } from '../api-constants';
import { addBodyClass } from '@angular/cdk/schematics';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  private boardItemsSubject: BehaviorSubject<Item[] | null> = new BehaviorSubject<Item[] | null>(null)

  constructor(private http: HttpClient){}

  
  public allBoardItemsObs(boardId: string): Observable<Item[] | null> {
    if (this.boardItemsSubject.value == null) {
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

}
