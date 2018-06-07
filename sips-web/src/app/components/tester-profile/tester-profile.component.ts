import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TesterService } from '../../services/tester.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ImageUploadDialogComponent } from '../image-upload-dialog/image-upload-dialog.component';

@Component({
  selector: 'app-tester-profile',
  templateUrl: './tester-profile.component.html',
  styleUrls: ['./tester-profile.component.scss']
})
export class TesterProfileComponent implements OnInit {
  user: any;
  tester: any;

  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  imageUploadDialogRef: MatDialogRef<ImageUploadDialogComponent>;

  constructor(
    private authService: AuthService,
    private testerService: TesterService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private confirmDialog: MatDialog,
    private imageUploadDialog: MatDialog
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

  onClickEditTester() {
    this.router.navigate(['/testers/tester', this.tester._id, 'edit']);
    return false;
  }

  openUploadProfileImageDialog() {
    this.imageUploadDialogRef = this.imageUploadDialog.open(ImageUploadDialogComponent, {
      disableClose: false
    });

    this.imageUploadDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.testerService.uploadProfileImage(this.tester._id, result).subscribe(data => {
          if (data.success) {
            this.flashMessage.show(data.msg, {
              cssClass: 'alert-success',
              timeout: 5000
            });

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
      else {

      }
      this.imageUploadDialogRef = null;
    });
  }

  openDeleteTesterDialog() {
    this.confirmDialogRef = this.confirmDialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.confirmDialogRef.afterClosed().subscribe(result => {
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
      this.confirmDialogRef = null;
    });
  }

  openResendConfirmationEmailDialog() {
    this.confirmDialogRef = this.confirmDialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = "Resend confirmation email?"

    this.confirmDialogRef.afterClosed().subscribe(result => {
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
      this.confirmDialogRef = null;
    });
  }
}
