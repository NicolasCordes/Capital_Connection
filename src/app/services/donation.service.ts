import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Donation } from "../types/donation.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class DonationService {

    http = inject(HttpClient);
    urlBase = `${environment.urlServer}/accounts`;

    createDonation(accountId: number | null | undefined, donation: Donation): Observable<Donation> {
      return this.http.post<Donation>(`${this.urlBase}/${accountId}/donations`, donation);
    }

    getDonationsByAccountId(accountId: number | undefined): Observable<Donation[]> {
      return this.http.get<Donation[]>(`${this.urlBase}/${accountId}/donations`).pipe(
        map(donations =>
          donations.filter(donation => donation.isActivated &&
                                      (donation.status === 'approved' || donation.status === 'rejected'))
        )
      );
    }


  }
