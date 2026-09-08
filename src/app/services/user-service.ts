import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';
import { User } from '../model/user';
import { ApiConstants } from '../api-constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  public allUsersSubject: BehaviorSubject<User[] | null> = new BehaviorSubject<User[] | null>(null)

  constructor(private http: HttpClient){}

  allTeamsObs(): Observable<User[] | null> {
    if (this.allUsersSubject.value == null) {
      this.getAllUsers().subscribe()
    }
    return this.allUsersSubject.asObservable()
  }

  private getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${ApiConstants.BASE_URL}/users`).pipe(
      tap(users => this.allUsersSubject.next(users))
    )
  }
  
}
