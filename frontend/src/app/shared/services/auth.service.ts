import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post<any>(`${environment.serviceUrl}/api/auth/login`, { email, password }).pipe(
      tap((response) => this.setToken(response.accessToken))
    );
  }

  isUserLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  // logout(force = false) {
  //   if (force) {
  //     localStorage.removeItem('access_token');
  //   }
  //   return this.httpClient.post(`${environment.serviceUrl}/logout`, {}).pipe(tap(response => {
  //     localStorage.removeItem('access_token');
  //   }));
  // }

  // getCurrentUser(): Observable<UserModel> {
  //   return this.httpClient.get<UserModel>(`${environment.serviceUrl}/me`);
  // }

  getToken() {
    return localStorage.getItem('access_token');
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }
}