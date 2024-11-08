import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient)
  urlBase = 'http://localhost:3000/users';

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.urlBase);
  }

  getUserById(id: Number | null): Observable<User> {
    return this.http.get<User>(`${this.urlBase}/${id}`)
  }

  postUser(user: User): Observable<User> {
    return this.http.post<User>(this.urlBase, user)
  }

  deleteUser(id: Number | undefined): Observable<User> {
    return this.http.delete<User>(`${this.urlBase}/${id}`)
  }

  updateUser(id: Number | null, user: User): Observable<User> {
    return this.http.put<User>(`${this.urlBase}/${id}`, user);
  }
}

