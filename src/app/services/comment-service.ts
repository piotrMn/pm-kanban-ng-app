import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Comment } from '../model/comment';
import { ApiConstants } from '../api-constants';
import { CreateCommentRequest } from '../model/create-comment-request';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  private itemCommentsSubject: BehaviorSubject<Comment[] | null> = new BehaviorSubject<Comment[] | null>(null)
  currentItemId!: string

  constructor(private http: HttpClient){}

  public allItemCommentsObs(itemId: string): Observable<Comment[] | null> {
    if (this.itemCommentsSubject.value === null || this.currentItemId !== itemId ) {
      this.currentItemId = itemId
      this.getAllItemComments(itemId).subscribe()
    } 
    return this.itemCommentsSubject.asObservable()
  }

  private getAllItemComments(itemId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${ApiConstants.BASE_URL}/comments?itemId=${itemId}`).pipe(
      tap((items => this.itemCommentsSubject.next(items)))
    );
  }

  public deleteComment(commentId: string, itemId: string): Observable<string> {
    return this.http.delete<string>(`${ApiConstants.BASE_URL}/comments/${commentId}`).pipe(
      tap(() => this.getAllItemComments(itemId).subscribe())
    )
  }

  public saveComment(request: CreateCommentRequest): Observable<string> {
    return this.http.post<string>(`${ApiConstants.BASE_URL}/comments`, request).pipe(
      tap(() => this.getAllItemComments(request.itemId).subscribe())
    )
  }
  
}
