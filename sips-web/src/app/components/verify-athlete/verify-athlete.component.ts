import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AthleteService } from '../../services/athlete.service';
import 'rxjs/add/operator/filter';
import * as moment from 'moment'; // add this 1 of 4


@Component({
  selector: 'app-verify-athlete',
  templateUrl: './verify-athlete.component.html',
  styleUrls: ['./verify-athlete.component.css']
})
export class VerifyAthleteComponent implements OnInit {
  token: string;

  first_name: string;
  last_name: string;
  date_of_birth: Date;
  heightFeet: number;
  heightInches: number;
  weight: number;
  password: string;
  confirm_password: string;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private athleteService: AthleteService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.token)
      .subscribe(params => {
        console.log(params);
        this.token = params.token;
        console.log(this.token);
        this.authService.setToken(this.token);
      });
  }

  onVerifySubmit() {
    const athlete = {
      first_name: this.first_name,
      last_name: this.last_name,
      date_of_birth: moment(this.date_of_birth).toISOString(),
      height: ((this.heightFeet * 12) + this.heightInches),
      weight: this.weight,
      password: this.password
    }


    if (!this.validateService.validateAthleteVerification(athlete)) {
      this.flashMessage.show('Please fill in all fields!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    if (!this.validateService.validatePasswordMatch(this.password, this.confirm_password)) {
      this.flashMessage.show('Passwords do not match!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    this.athleteService.verifyAthlete(athlete).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Successfully verified!', {
          cssClass: 'alert-success',
          timeout: 5000
        });

        this.authService.storeUserData(data.token, data.athlete);
        this.router.navigate(['/']);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    })
  }


}
