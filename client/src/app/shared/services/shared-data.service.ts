import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  public userRole = new BehaviorSubject<string>('');

  constructor() { }

  sendCurrentUserRole(role: string) {
    this.userRole.next(role);
  }

  getCurrentUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  clearCurrentUserRole() {
    this.userRole.next('');
  }
}
