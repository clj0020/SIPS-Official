import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { User } from '../classes/user';
import { environment } from '../../environments/environment';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  environmentName = environment.envName;
  serverUrl: string;

  @Output() userEmitter: EventEmitter<any> = new EventEmitter();
  @Output() tokenEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: Http,
    private loaderService: LoaderService
  ) {
    if (this.environmentName == 'dev') {
      this.serverUrl = "http://localhost:8080/"
    }
    else if (this.environmentName == 'prod') {
      this.serverUrl = "https://server-dot-sips-1350.appspot.com/";
    }

    console.log(this.environmentName);
  }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "users/register";

    return this.http.post(url, user, { headers: headers })
      .map(res => res.json());
  }

  registerAdmin(admin) {
    this.showLoader();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "admins/register";

    return this.http.post(url, admin, { headers: headers }).catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      })
      .map(res => res.json());
  }

  authenticateUser(user) {
    this.showLoader();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "users/login";

    return this.http.post(url, user, { headers: headers })
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      })
      .map(res => res.json());
  }

  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "users/profile";

    return this.http.get(url, { headers: headers })
      .map(res => res.json());
  }

  setUser(newUser) {
    console.log("User object set in AuthService..");
    console.log(newUser);
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

  onCatch(error: any, caught: Observable<any>): Observable<any> {
    console.log("CAught exception: " + error.error);
    return Observable.throw(error);
  }

  onSuccess(res: Response): void {
    console.log('Request successful');
  }

  onError(res: Response): void {
    console.log('Error, status code: ' + res.status);
  }

  onEnd(): void {
    this.hideLoader();
  }

  showLoader(): void {
    this.loaderService.show();
  }

  hideLoader(): void {
    this.loaderService.hide();
  }


}
