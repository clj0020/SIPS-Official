import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AthleteService } from '../../services/athlete.service';
import { InjuryService } from '../../services/injury.service';
import { Injury } from '../../classes/injury';
import { Sport } from '../../classes/sport';

@Component({
  selector: 'app-athlete-edit',
  templateUrl: './athlete-edit.component.html',
  styleUrls: ['./athlete-edit.component.scss']
})
export class AthleteEditComponent implements OnInit {
  user: any;
  athlete: any;
  injuries: Injury[] = [];

  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: Date;
  heightInches: number;
  heightFeet: number;
  weight: number;
  selectedSport: Sport;
  position: string;
  file: File;

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
    private authService: AuthService,
    private athleteService: AthleteService,
    private injuryService: InjuryService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) {
    this.user = this.authService.loadUser();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.athleteService.getAthleteById(id).subscribe(data => {
      if (data.success) {
        this.athlete = data.athlete;
        this.first_name = this.athlete.first_name;
        this.last_name = this.athlete.last_name;
        this.email = this.athlete.email;
        this.date_of_birth = this.athlete.date_of_birth;
        this.heightFeet = this.getHeightFeet(this.athlete.height);
        this.heightInches = this.getHeightInches(this.athlete.height);
        this.weight = this.athlete.weight;

        for (var i = 0; i < this.sports.length; i++) {
          if (this.sports[i].title == this.athlete.sport) {
            this.selectedSport = this.sports[i];

            for (var j = 0; j < this.sports[i].positions.length; j++) {
              if (this.sports[i].positions[j] == this.athlete.position) {
                this.position = this.sports[i].positions[j];
              }
            }
          }
        }

        this.loadInjuries(this.athlete._id);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });

        this.router.navigate(['/athletes/athlete/', this.athlete._id]);
      }
    });
  }

  onPersonalSubmit() {
    this.athlete.first_name = this.first_name;
    this.athlete.last_name = this.last_name;
    this.athlete.date_of_birth = this.date_of_birth;


    this.athleteService.editAthlete(this.athlete, this.file).subscribe(data => {
      if (data.success) {
        this.athlete = data.athlete;

        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 5000
        });
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });

    return false;
  }

  onSportSubmit() {
    this.athlete.height = ((this.heightFeet * 12) + this.heightInches);
    this.athlete.weight = this.weight;
    this.athlete.sport = this.selectedSport.title;
    this.athlete.position = this.position;

    this.athleteService.editAthlete(this.athlete, this.file).subscribe(data => {
      if (data.success) {
        this.athlete = data.athlete;

        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 5000
        });
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });

    return false;
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }
  }

  loadInjuries(athleteId) {
    this.injuryService.getAthleteInjuries(athleteId).subscribe(data => {
      if (data.success) {
        this.injuryService.storeInjuries(data.injuries);
        this.injuries = data.injuries;
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  getHeightFeet(height) {
    return ((height / 12) - ((height % 12) / 12));
  }

  getHeightInches(height) {
    return (height % 12);
  }

  formatDate(created_at): string {
    return moment(created_at).format('MM/DD/YYYY [at] hh:mmA');
  }

  formatBirthday(birthdayDate): string {
    return moment(birthdayDate).format('MMMM Do, YYYY');
  }

}
