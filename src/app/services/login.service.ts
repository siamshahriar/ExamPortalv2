import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  //get current user
  public getCurrentUser() {
    return this.http.get(`${baseUrl}/current-user`);
  }

  //generate token
  public generateToken(loginData: any) {
    return this.http.post(`${baseUrl}/generate-token`, loginData);
  }

  //login user: set token in local storage
  public loginUser(token: string) {
    localStorage.setItem('token', token);
    return true;
  }

  //isLoggedIn: check if user is logged in
  public isLoggedIn() {
    let tokenStr = localStorage.getItem('token');
    return tokenStr !== null && tokenStr.length > 0;
  }

  //logout: remove token from local storage
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  //get token
  public getToken() {
    return localStorage.getItem('token');
  }

  //set user detail
  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  //getUser
  public getUser() {
    let userStr = localStorage.getItem('user');
    if (userStr !== null) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null;
    }
  }

  //get user role
  public getUserRole() {
    let user = this.getUser();
    if (user) {
      return user.authorities[0].authority; // Assuming the first authority is the role
    } else {
      return null;
    }
  } 
}
