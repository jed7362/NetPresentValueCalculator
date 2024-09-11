import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NpvRequest } from './npv-request.model';
import { NpvResult } from './npv-result.model';

@Injectable({
  providedIn: 'root',
})
export class NpvService {
  private apiUrl = 'https://localhost:7158/NetPresentValueCalculator'; // URL of the .NET Core API

  constructor(private http: HttpClient) {}

  // Return an observable with a list of NPV results
  calculateNPV(npvRequest: NpvRequest): Observable<{ results: NpvResult[] }> {
    return this.http.post<{ results: NpvResult[] }>(this.apiUrl, npvRequest);
  }
}
