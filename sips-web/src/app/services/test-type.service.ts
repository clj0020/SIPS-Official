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
import { LoaderService } from '../services/loader.service';
import { environment } from '../../environments/environment';

@Injectable()
export class TestTypeService {
  authToken: string;
  testType: any;
  testTypes: any[];
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

  addTestType(testType, testTypeImageFile) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.delete('Content-Type');
    headers.append('Accept', 'application/json');

    let formData: FormData = new FormData();

    if (testTypeImageFile) {
      formData.append('cover', testTypeImageFile, testTypeImageFile.name);
    }

    formData.append('title', testType.title);
    formData.append('description', testType.description);
    formData.append('duration', testType.duration);
    formData.append('organization', testType.organization);

    let url = this.serverUrl + "testTypes/add";

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

  uploadTestTypeImage(testTypeId, testTypeImageFile) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.delete('Content-Type');
    headers.append('Accept', 'application/json');

    let formData: FormData = new FormData();

    formData.append('cover', testTypeImageFile, testTypeImageFile.name);
    formData.append('id', testTypeId);

    let url = this.serverUrl + "testTypes/upload-image";

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

  getTestTypeById(id) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "testTypes/" + id;

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

  getTestTypesFromOrganization(organizationId) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "testTypes/organization/" + organizationId;

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

  storeTestTypes(testTypes) {
    this.testTypes = testTypes;
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
