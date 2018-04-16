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
export class TestingDataService {
  authToken: string;
  testData: any;
  testingDataList: any[];

  constructor(
    private http: Http,
    private authService: AuthService
  ) { }

  getTestingDataForAthlete(athleteId) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = 'http://localhost:8080/testingData/get-athlete-test-data/' + athleteId;

    return this.http.get(url, { headers: headers })
      .map(res => res.json());
  }

  getTestDataById(id, athleteId) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = 'http://localhost:8080/testingData/athlete/' + athleteId + '/' + id;

    return this.http.get(url, { headers: headers })
      .map(res => res.json());
  }

  storeTestingData(testingData) {
    this.testingDataList = testingData;
  }

}
