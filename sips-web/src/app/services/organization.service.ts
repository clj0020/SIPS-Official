import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
import { Organization } from '../classes/organization';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class OrganizationService {
  authToken: any;
  organization: Organization;

  constructor(
    private http: Http,
    private authService: AuthService,
    private loaderService: LoaderService
  ) { }

  addOrganization(organization) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/organizations/add', organization, { headers: headers })
      .map(res => res.json());
  }

  getOrganization(organizationId): Observable<any> {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    console.log("AuthToken: " + this.authToken);
    // let organizationId = this.authService.loadUser().organization;
    // console.log(organizationId);
    let url = 'http://localhost:8080/organizations/' + organizationId
    return this.http.get(url, { headers: headers }).catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      })
      .map((res: Response) => {
        let body = res.json();
        return body || {};
      });
  }

  storeOrganization(organization) {
    localStorage.setItem('organization', organization);
    this.organization = organization;
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
