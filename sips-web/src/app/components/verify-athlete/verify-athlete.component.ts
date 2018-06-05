import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AthleteService } from '../../services/athlete.service';
import { Sport } from '../../classes/sport';
import { Injury } from '../../classes/injury';
import 'rxjs/add/operator/filter';
import * as moment from 'moment'; // add this 1 of 4


@Component({
  selector: 'app-verify-athlete',
  templateUrl: './verify-athlete.component.html',
  styleUrls: ['./verify-athlete.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerifyAthleteComponent implements OnInit {
  token: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;

  heightFeet: number;
  heightInches: number;
  weight: number;
  selectedSport: Sport;
  position: string;

  injuries: Injury[] = [];
  injury: string;
  date_occurred: Date;

  password: string;
  confirm_password: string;

  termsAccepted: boolean;

  personalFormGroup: FormGroup;
  sportFormGroup: FormGroup;
  pastInjuriesFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  termsOfServiceFormGroup: FormGroup;

  sports = [
    new Sport("Baseball", ["Pitcher", "Catcher", "First Baseman", "Second Baseman", "Third Baseman", "Shortstop", "Left Fielder", "Center Fielder", "Right Fielder"]),
    new Sport("Basketball", ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"]),
    new Sport("Cheerleading", ["Flyer", "Base", "Spotter"]),
    new Sport("Cross Country Running", ["Runner"]),
    new Sport("Football", ["Quarterback", "Running Back", "Wide Receiver", "Tight End", "Center", "Guard", "Offensive Tackle", "Defensive Tackle", "Defensive End", "Middle Linebacker", "Linebacker", "Cornerback", "Free Safety", "Strong Safety"]),
    new Sport("Golf", ["Golfer"]),
    new Sport("Hockey", ["Goalie", "Defenseman", "Wing", "Center"]),
    new Sport("Soccer", ["Forward", "Midfielder", "Defender", "Sweeper", "Goalie"]),
    new Sport("Swimming and Diving", ["Swimmer"]),
    new Sport("Tennis", ["Player"]),
    new Sport("Track and Field", ["Running", "Jumping", "Throwing", "Combined"]),
    new Sport("Volleyball", ["Wing Spiker (Left)", "Wing Spiker (Right)", "Attacker", "Setter", "Middle Blocker", "Libero", "Defensive Specialist"]),
    new Sport("Wrestling", ["Wrestler"])
  ];

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private athleteService: AthleteService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService,
    private _formBuilder: FormBuilder
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

    this.personalFormGroup = this._formBuilder.group({
      first_name: [this.first_name, Validators.required],
      last_name: [this.last_name, Validators.required],
      date_of_birth: [this.date_of_birth, Validators.required]
    });

    this.sportFormGroup = this._formBuilder.group({
      heightFeet: [this.heightFeet, Validators.required],
      heightInches: [this.heightInches, Validators.required],
      weight: [this.weight, Validators.required],
      selectedSport: [this.selectedSport, Validators.required],
      position: [this.position, Validators.required]
    });

    this.pastInjuriesFormGroup = this._formBuilder.group({
      injuries: this._formBuilder.array([])
    });

    this.passwordFormGroup = this._formBuilder.group({
      password: [this.password, Validators.required],
      confirm_password: [this.confirm_password, Validators.required]
    });

    this.termsOfServiceFormGroup = this._formBuilder.group({
      termsAccepted: [this.termsAccepted, Validators.required]
    })

  }

  initInjury() {
    return this._formBuilder.group({
      title: ['', Validators.required],
      date_occurred: ['']
    });
  }

  addInjury() {
    // add injury to the list
    const control = <FormArray>this.pastInjuriesFormGroup.controls['injuries'];
    control.push(this.initInjury());
  }

  removeInjury(i: number) {
    // remove injury from the list
    const control = <FormArray>this.pastInjuriesFormGroup.controls['injuries'];
    control.removeAt(i);
  }

  onVerifySubmit() {
    const athlete = {
      first_name: this.personalFormGroup.value.first_name,
      last_name: this.personalFormGroup.value.last_name,
      date_of_birth: moment(this.personalFormGroup.value.date_of_birth).toISOString(),
      height: ((this.sportFormGroup.value.heightFeet * 12) + this.sportFormGroup.value.heightInches),
      weight: this.sportFormGroup.value.weight,
      sport: this.sportFormGroup.value.selectedSport.title,
      position: this.sportFormGroup.value.position,
      injuries: this.pastInjuriesFormGroup.value.injuries,
      password: this.passwordFormGroup.value.password
    }


    if (!this.validateService.validateAthleteVerification(athlete)) {
      console.log(athlete);
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

  isNullOrUndefined(arr): boolean {
    for (var i = 0; i < arr.length; i++) {
      var itm = arr[i];
      if (itm === null || itm === undefined) {
        return true;
      }
    }
    return false;
  }

}
