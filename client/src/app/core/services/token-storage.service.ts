import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  getDecodedAccessToken(): any {
    try {
      return jwt_decode(this.getToken() || '');
    } catch (err) {
      return null
    }
  }

  deleteToken(): void {
    window.localStorage.clear();
  }
}
