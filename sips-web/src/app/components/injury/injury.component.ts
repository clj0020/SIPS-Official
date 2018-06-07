import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InjuryService } from '../../services/injury.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-injury',
  templateUrl: './injury.component.html',
  styleUrls: ['./injury.component.scss']
})
export class InjuryComponent implements OnInit {
  user: any;
  injury: any;
  athleteId: string;

  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private authService: AuthService,
    private injuryService: InjuryService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private confirmDialog: MatDialog,
  ) {
    this.user = this.authService.loadUser();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.athleteId = this.route.snapshot.paramMap.get('athleteId');

    this.injuryService.getInjuryById(id).subscribe(data => {
      if (data.success) {
        this.injury = data.injury;
        // this.loadAthlete(athleteId);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  onClickEditInjury() {
    this.router.navigate(['/athletes/athlete', this.athleteId, 'injuries', this.injury._id, 'edit']);
    return false;
  }

  openDeleteInjuryDialog() {
    this.confirmDialogRef = this.confirmDialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.injuryService.deleteInjury(this.injury._id).subscribe(data => {
          if (data.success) {
            this.flashMessage.show(data.msg, {
              cssClass: 'alert-success',
              timeout: 5000
            });

            this.router.navigate(['/']);
          }
          else {
            this.flashMessage.show(data.msg, {
              cssClass: 'alert-danger',
              timeout: 5000
            });
          }
        });
      }
      this.confirmDialogRef = null;
    });
  }

  formatDate(created_at): string {
    return moment(created_at).format('MM/DD/YYYY [at] hh:mmA');
  }


}
