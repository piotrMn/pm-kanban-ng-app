import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { Team } from '../model/team';
import { ApiConstants } from '../api-constants';
import { CreateTeamRequest } from '../model/create-team-request';

@Injectable({
  providedIn: 'root',
})

export class TeamService {

  private allTeamsSubject: BehaviorSubject<Team[] | null> = new BehaviorSubject<Team[] | null>(null)

  constructor(private http: HttpClient){}

  allTeamsObs(): Observable<Team[] | null> {
    if (this.allTeamsSubject.value == null) {
      this.getAllTeams().subscribe()
    }
    return this.allTeamsSubject.asObservable()
  }

  private getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${ApiConstants.BASE_URL}/teams`).pipe(
      tap(teams => this.allTeamsSubject.next(teams))
    )
  }

  postCreateTeamRequest(request: CreateTeamRequest): Observable<string> {
    return this.http.post<string>(`${ApiConstants.BASE_URL}/teams`, request).pipe(
      tap(() => this.getAllTeams().subscribe())
    )
  }

  removeUserFromTeam(teamId: string, userId: string): Observable<Object> {
    return this.http.delete(`${ApiConstants.BASE_URL}/teams/${teamId}/members`, { body: userId }).pipe(
      tap(() => this.getAllTeams().subscribe())
    )
  }

  addUserToTeam(teamId: string, userId: string): Observable<Object> {
    return this.http.post<string>(`${ApiConstants.BASE_URL}/teams/${teamId}/members`, userId).pipe(
      tap(() => this.getAllTeams().subscribe())  
    )
  }

}

