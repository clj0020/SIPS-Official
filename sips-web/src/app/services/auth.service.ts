import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { User } from '../classes/user';

@Injectable()
export class AuthService {
  authToken: any;
  user: User;

  @Output() userEmitter: EventEmitter<User> = new EventEmitter();
  @Output() tokenEmitter: EventEmitter<any> = new EventEmitter();

  // user$: Observable<any>;
  // private userSubject: Subject<any>;

  constructor(private http: Http) {
    //    this.userSubject = new Subject<any>();
  }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/users/register', user, { headers: headers })
      .map(res => res.json());
  }

  registerAdmin(admin) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/admins/register', admin, { headers: headers })
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/users/login', user, { headers: headers })
      .map(res => res.json());
  }

  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/users/profile', { headers: headers })
      .map(res => res.json());
  }

  setUser(newUser) {
    this.user = newUser;
    this.userEmitter.emit(this.user);
    // this.userSubject.next(newUser);
  }

  setToken(newToken) {
    localStorage.setItem('id_token', newToken);
    this.authToken = newToken;
    this.tokenEmitter.emit(this.authToken);
  }

  // getUser(): Observable<any> {
  //   return this.userSubject.asObservable();
  // }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
    this.userEmitter.emit(this.user);
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
    return this.authToken;
  }

  loadUser() {
    const user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    return this.user;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }


}
