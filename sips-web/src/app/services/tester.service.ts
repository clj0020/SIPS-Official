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
import { LoaderService } from '../services/loader.service';

@Injectable()
export class TesterService {
  authToken: string;
  tester: any;
  testers: any[];
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

  addTester(tester) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "testers/add";
    return this.http.post(url, tester, { headers: headers }).catch(this.onCatch)
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

  editTester(tester, profileImage) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.delete('Content-Type');
    headers.append('Accept', 'application/json');

    let formData: FormData = new FormData();

    formData.append('id', tester._id);

    if (profileImage) {
      formData.append('profileImage', profileImage, profileImage.name);
    }
    if (tester.first_name) {
      formData.append('first_name', tester.first_name);
    }
    if (tester.last_name) {
      formData.append('last_name', tester.last_name);
    }
    if (tester.email) {
      formData.append('email', tester.email);
    }

    let url = this.serverUrl + "testers/" + tester._id;

    return this.http.put(url, formData, { headers: headers }).catch(this.onCatch)
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

  uploadProfileImage(testerId, profileImageFile) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.delete('Content-Type');
    headers.append('Accept', 'application/json');

    let formData: FormData = new FormData();

    formData.append('profileImage', profileImageFile, profileImageFile.name);
    formData.append('id', testerId);

    let url = this.serverUrl + "testers/upload-profile-image";

    return this.http.post(url, formData, { headers: headers }).catch(this.onCatch)
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

  deleteTester(testerId) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "testers/" + testerId;

    return this.http.delete(url, { headers: headers }).catch(this.onCatch)
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

  verifyTester(tester) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let url = this.serverUrl + "testers/verify";
    return this.http.post(url, tester, { headers: headers }).catch(this.onCatch)
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

  resendTesterVerificationEmail(testerId) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "testers/resend-verification/" + testerId;

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

  getTesterById(id) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + 'testers/tester/' + id;

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

  getTestersFromOrganization(organizationId) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    let url = this.serverUrl + "testers/organization";
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

  storeTesters(testers) {
    this.testers = testers;
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
