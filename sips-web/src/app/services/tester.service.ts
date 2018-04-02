import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { User } from '../classes/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TesterService {
  authToken: string;
  tester: any;
  testers: any[];

  constructor(
    private http: Http,
    private authService: AuthService
  ) { }

  addTester(tester) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/testers/add', tester, { headers: headers })
      .map(res => res.json());
  }

  verifyTester(tester) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/testers/verify', tester, { headers: headers })
      .map(res => res.json());
  }

  getTestersFromOrganization(organizationId) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/testers/get-testers-from-organization', { headers: headers })
      .map(res => res.json());
  }

  storeTesters(testers) {
    this.testers = testers;
  }

}
