import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HandleErrorService } from 'src/app/core/services/handle-error.service';
import { Role } from '../schema/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private _http: HttpClient,
    private _handleErrorService: HandleErrorService
  ) { }


  getRole(id: string): Observable<Role> {
    return this._http.get<{ data: Role }>('roles/' + id,)
      .pipe(
        map((role) => role['data'] || {}),
        catchError(this._handleErrorService.handleError)
      );;
  }
}
