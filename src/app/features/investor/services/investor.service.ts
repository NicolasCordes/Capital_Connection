import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Investor } from "../models/investor.model";


@Injectable({
    providedIn: 'root'
  })
  export class InvestorService {
  
    http = inject(HttpClient)
    urlBase = 'http://localhost:3000/investors';
  
    getInvestor(): Observable<Investor[]> {
      return this.http.get<Investor[]>(this.urlBase);
    }
  
    getInvestorById(id: Number | null): Observable<Investor> {
      return this.http.get<Investor>(`${this.urlBase}/${id}`)
    }
  
    postInvestor(investor: Investor): Observable<Investor> {
      return this.http.post<Investor>(this.urlBase, investor)
    }
  
    deleteInvestor(id: Number | undefined): Observable<Investor> {
      return this.http.delete<Investor>(`${this.urlBase}/${id}`)
    }
  
    updateInvestor(id: Number | null, investor: Investor): Observable<Investor> {
      return this.http.put<Investor>(`${this.urlBase}/${id}`, investor);
    }
  }