import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InjuryService } from '../../services/injury.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';

@Component({
  selector: 'app-add-injury',
  templateUrl: './add-injury.component.html',
  styleUrls: ['./add-injury.component.css']
})
export class AddInjuryComponent implements OnInit {
  private athleteId: string;
  private title: string;
  private date_occurred: Date;

  constructor(
    private authService: AuthService,
    private injuryService: InjuryService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.athleteId = this.route.snapshot.paramMap.get('athleteId');
  }

  onAddInjurySubmit() {
    let injury = {
      title: this.title,
      athlete: this.athleteId,
      date_occurred: moment(this.date_occurred).toISOString(),
    };

    this.injuryService.addInjury(injury).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Successfully added injury!', {
          cssClass: 'alert-success',
          timeout: 5000
        });

        this.router.navigate(['/athletes/athlete/' + this.athleteId]);
      }
      else {
        this.flashMessage.show('Error adding injury!', {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    })

  }

}
