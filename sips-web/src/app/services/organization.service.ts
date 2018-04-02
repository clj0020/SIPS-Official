import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Organization } from '../classes/organization';
import { AuthService } from '../services/auth.service';

@Injectable()
export class OrganizationService {
  authToken: any;
  organization: Organization;

  constructor(
    private http: Http,
    private authService: AuthService
  ) { }

  addOrganization(organization) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/organizations/add', organization, { headers: headers })
      .map(res => res.json());
  }

  getOrganization(organizationId) {
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    console.log("AuthToken: " + this.authToken);
    // let organizationId = this.authService.loadUser().organization;
    // console.log(organizationId);
    let url = 'http://localhost:8080/organizations/' + organizationId
    return this.http.get(url, { headers: headers })
      .map(res => res.json());
  }

  storeOrganization(organization) {
    localStorage.setItem('organization', organization);
    this.organization = organization;
  }

}
