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
export class AthleteService {
  authToken: string;
  athlete: any;
  athletes: any[];
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

  addAthlete(athlete) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "athletes";

    return this.http.post(url, athlete, { headers: headers }).catch(this.onCatch)
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

  editAthlete(athlete, profileImage) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.delete('Content-Type');
    headers.append('Accept', 'application/json');

    let formData: FormData = new FormData();

    formData.append('id', athlete._id);

    if (profileImage) {
      formData.append('profileImage', profileImage, profileImage.name);
    }
    if (athlete.first_name) {
      formData.append('first_name', athlete.first_name);
    }
    if (athlete.last_name) {
      formData.append('last_name', athlete.last_name);
    }
    if (athlete.email) {
      formData.append('email', athlete.email);
    }
    if (athlete.date_of_birth) {
      formData.append('date_of_birth', athlete.date_of_birth);
    }
    if (athlete.height) {
      formData.append('height', athlete.height);
    }
    if (athlete.weight) {
      formData.append('weight', athlete.weight);
    }
    if (athlete.sport) {
      formData.append('sport', athlete.sport);
    }
    if (athlete.position) {
      formData.append('position', athlete.position);
    }

    let url = this.serverUrl + "athletes/" + athlete._id;

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

  uploadProfileImage(athleteId, profileImageFile) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.delete('Content-Type');
    headers.append('Accept', 'application/json');

    let formData: FormData = new FormData();

    formData.append('profileImage', profileImageFile, profileImageFile.name);
    formData.append('id', athleteId);

    let url = this.serverUrl + "athletes/upload-profile-image";

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

  deleteAthlete(athleteId) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "athletes/" + athleteId;

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

  resendAthleteVerificationEmail(athleteId) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "athletes/resend-verification/" + athleteId;

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

  verifyAthlete(athlete) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "athletes/verify";

    return this.http.post(url, athlete, { headers: headers }).catch(this.onCatch)
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

  getAthletesFromOrganization(organizationId) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + "athletes/get-athletes-from-organization";

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

  getAthleteById(id) {
    this.showLoader();

    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    let url = this.serverUrl + 'athletes/' + id;

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

  storeAthletes(athletes) {
    this.athletes = athletes;
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
