import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Donation } from "../models/donation.model";


@Injectable({
    providedIn: 'root'
  })
  export class DonationService {
  
    http = inject(HttpClient)
    urlBase = 'http://localhost:3000/donations';
  
    getDonation(): Observable<Donation[]> {
      return this.http.get<Donation[]>(this.urlBase);
    }
  
    getDonationById(id: Number | null): Observable<Donation> {
      return this.http.get<Donation>(`${this.urlBase}/${id}`)
    }
  
    postDonation(donation: Donation): Observable<Donation> {
      return this.http.post<Donation>(this.urlBase, donation)
    }
  
    deleteDonation(id: Number | undefined): Observable<Donation> {
      return this.http.delete<Donation>(`${this.urlBase}/${id}`)
    }
  
    updateDonation(id: Number | null, donation: Donation): Observable<Donation> {
      return this.http.put<Donation>(`${this.urlBase}/${id}`, donation);
    }
  }