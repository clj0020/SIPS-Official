import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
import { Organization } from '../classes/organization';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { environment } from '../../environments/environment';

@Injectable()
export class OrganizationService {
  authToken: any;
  organization: Organization;
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

  addOrganization(organization) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "organizations/add";

    return this.http.post(url, organization, { headers: headers }).catch(this.onCatch)
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

  getOrganization(organizationId): Observable<any> {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + 'organizations/' + organizationId;

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

  storeOrganization(organization) {
    localStorage.setItem('organization', organization);
    this.organization = organization;
  }

  loadOrganization() {
    const organization = localStorage.getItem('organization');
    this.organization = JSON.parse(organization);
    return this.organization;
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
