import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WipLimit } from '../model/wip-limit';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConstants } from '../api-constants';

@Injectable({
  providedIn: 'root',
})
export class WipLimitService {

  public allWipLimitsSubject: BehaviorSubject<WipLimit[] | null> = new BehaviorSubject<WipLimit[] | null>(null)

  constructor(private http: HttpClient){}

  allWipLimitsObs(): Observable<WipLimit[] | null> {
    if (this.allWipLimitsSubject.value == null) {
      this.getAllWipLimits().subscribe()
    }
    return this.allWipLimitsSubject.asObservable()
  }
  
  private getAllWipLimits(): Observable<WipLimit[]> {
    return this.http.get<WipLimit[]>(`${ApiConstants.BASE_URL}/wip-limits`).pipe(
      tap(wipLimits => this.allWipLimitsSubject.next(wipLimits))
    )
  }
  
}
