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
import { environment } from '../../environments/environment';

@Injectable()
export class TesterService {
  authToken: string;
  tester: any;
  testers: any[];
  environmentName = environment.envName;
  serverUrl: string;

  constructor(
    private http: Http,
    private authService: AuthService
  ) {
    if (this.environmentName == 'dev') {
      this.serverUrl = "http://localhost:8080/"
    }
    else if (this.environmentName == 'prod') {
      this.serverUrl = "https://server-dot-sips-1350.appspot.com/";
    }
  }

  addTester(tester) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "testers/add";
    return this.http.post(url, tester, { headers: headers })
      .map(res => res.json());
  }

  verifyTester(tester) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let url = this.serverUrl + "testers/verify";
    return this.http.post(url, tester, { headers: headers })
      .map(res => res.json());
  }

  getTestersFromOrganization(organizationId) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let url = this.serverUrl + "testers/get-testers-from-organization";
    return this.http.get(url, { headers: headers })
      .map(res => res.json());
  }

  storeTesters(testers) {
    this.testers = testers;
  }

}
