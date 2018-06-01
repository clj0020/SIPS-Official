import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TesterService } from '../../services/tester.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-tester-profile',
  templateUrl: './tester-profile.component.html',
  styleUrls: ['./tester-profile.component.scss']
})
export class TesterProfileComponent implements OnInit {
  user: any;
  tester: any;

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private authService: AuthService,
    private testerService: TesterService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private dialog: MatDialog
  ) {
    this.user = this.authService.loadUser();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.testerService.getTesterById(id).subscribe(data => {
      if (data.success) {
        this.tester = data.tester;
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  openResendConfirmationEmailDialog() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Resend confirmation email?"

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testerService.resendTesterVerificationEmail(this.tester._id).subscribe(data => {
          if (data.success) {
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
      }
      this.dialogRef = null;
    });
  }


  openDeleteTesterDialog() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testerService.deleteTester(this.tester._id).subscribe(data => {
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
      this.dialogRef = null;
    });
  }

}
