import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry } from 'rxjs';
import { AuthDTO, AuthData } from 'src/app/data/auth/schema/auth.model';
import { User, UserDTO } from 'src/app/data/user/schema/user.model';
import { HandleErrorService } from './handle-error.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _http: HttpClient,
    private _handleErrorService: HandleErrorService,
    private _tokenStorageService: TokenStorageService
  ) { }

  login(data: AuthDTO): Observable<AuthData> {
    return this._http.post<AuthData>('auth/signin', data).pipe(
      catchError(this._handleErrorService.handleError)
    );;
  }

  register(data: UserDTO): Observable<User> {
    return this._http.post<{ data: User }>('auth/signup', data)
      .pipe(
        map((user) => user['data'] || {}),
        catchError(this._handleErrorService.handleError)
      );
  }


  logout() {
    this._tokenStorageService.deleteToken()
  }
}
