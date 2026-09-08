import { Injectable } from '@angular/core';
import { LoginRequest } from '../../../login-request';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../../login-response';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { SignupRequest } from '../model/signup-request';
import { ApiConstants } from '../api-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router){}

  postLoginRequest(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${ApiConstants.BASE_URL}/auth/login`, request);
  }

  postSignupRequest(request: SignupRequest): Observable<string> {
    return this.http.post<string>(`${ApiConstants.BASE_URL}/auth/register`, request);
  }

  handleSuccessfulLogin(response: LoginResponse) {
    localStorage.setItem('loggedUser', JSON.stringify(response))
  }

  isAuthenticated(): boolean {
    let loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      return true
    } else {
      return false
    }
  }

  getJwtToken(): string {
    let loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      return JSON.parse(loggedUser)['jwt']
    } else {
      return ''
    }
  }

  getUserName(): string {
    let loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      return JSON.parse(loggedUser)['userName']
    } else {
      return ''
    }
  }

  getUserEmail(): string {
    let loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      return JSON.parse(loggedUser)['email']
    } else {
      return ''
    }
  }

  getUserId(): string {
    let loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      return JSON.parse(loggedUser)['id']
    } else {
      return ''
    }
  }

  hasAuthority(authority: string): boolean {
    let loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      let authorities: string[] = JSON.parse(loggedUser)['authorities']
      return authorities.includes(authority) 
    } else {
      return false
    }
  }

  logout() {
    localStorage.removeItem('loggedUser')
    this.router.navigate(['login']);
  }
  
}
