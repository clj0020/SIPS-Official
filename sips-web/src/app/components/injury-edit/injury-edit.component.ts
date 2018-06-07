import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { InjuryService } from '../../services/injury.service';

@Component({
  selector: 'app-injury-edit',
  templateUrl: './injury-edit.component.html',
  styleUrls: ['./injury-edit.component.scss']
})
export class InjuryEditComponent implements OnInit {
  user: any;
  injury: any;

  athleteId: string;
  title: string;
  date_occurred: Date;

  constructor(
    private authService: AuthService,
    private injuryService: InjuryService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) {
    this.user = this.authService.loadUser();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.athleteId = this.route.snapshot.paramMap.get('athleteId');

    this.injuryService.getInjuryById(id).subscribe(data => {
      if (data.success) {
        this.injury = data.injury;
        this.title = this.injury.title;
        this.date_occurred = this.injury.date_occurred;
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  onInjuryEditSubmit() {
    this.injury.title = this.title;
    this.injury.date_occurred = this.date_occurred;

    this.injuryService.editInjury(this.injury).subscribe(data => {
      if (data.success) {
        this.injury = data.injury;

        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 5000
        });

        this.router.navigate(['/athletes/athlete', this.athleteId, 'injuries', this.injury._id]);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

}
