import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { User } from '../classes/user';
import { TestData } from '../classes/test-data';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { environment } from '../../environments/environment';

@Injectable()
export class TestingDataService {
  authToken: string;
  testData: TestData;
  testingDataList: TestData[];
  environmentName = environment.envName;
  serverUrl: string;

  constructor(
    private http: Http,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {
    if (this.environmentName == 'dev') {
      this.serverUrl = "http://localhost:8080/"
    }
    else if (this.environmentName == 'prod') {
      this.serverUrl = "https://server-dot-sips-1350.appspot.com/";
    }
  }

  getTestingDataForAthlete(athleteId) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + 'testingData/get-athlete-test-data/' + athleteId;

    return this.http.get(url, { headers: headers }).catch(this.onCatch)
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

  getTestDataById(id, athleteId) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + 'testingData/athlete/' + athleteId + '/' + id;

    return this.http.get(url, { headers: headers }).catch(this.onCatch)
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

  storeTestingData(testingData) {
    this.testingDataList = testingData;
  }

  onCatch(error: any, caught: Observable<any>): Observable<any> {
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
