import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  encryptUserEmail: string;
  decryptUserEmail: string;
  secret = "secretUserFrase";
  email;

  constructor() {}

  loggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  public saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUserEmail(user) {
    this.encryptUserEmail = CryptoJS.AES.encrypt(user.email, this.secret);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, this.encryptUserEmail);
  }

  public getUserEmail() {
    this.email = localStorage.getItem(USER_KEY);
    this.decryptUserEmail = CryptoJS.AES.decrypt(
      this.email,
      this.secret.trim()
    ).toString(CryptoJS.enc.Utf8);
    return this.decryptUserEmail;
  }
}
