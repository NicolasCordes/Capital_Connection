import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../types/account.model';
import { environment } from '../../environments/environment.development';
import { Address } from '../types/address.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  http = inject(HttpClient)
  urlBase = `${environment.urlServer}/accounts`;


  getUser(): Observable<Account[]> {
    return this.http.get<Account[]>(this.urlBase);
  }

  getUserById(id: Number | null): Observable<Account> {
    return this.http.get<Account>(`${this.urlBase}/${id}`)
  }

  postUser(account: Account): Observable<Account> {
    return this.http.post<Account>(this.urlBase, account)
  }

  deleteUser(id: Number | undefined): Observable<Account> {
    return this.http.delete<Account>(`${this.urlBase}/${id}`)
  }

  updateUser(id: Number | null, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.urlBase}/${id}`, account);
  }

  updateAddres(id: Number | null, address: Address): Observable<Account> {
    return this.http.put<Account>(`${this.urlBase}/${id}/address"`, address);
  }


}

