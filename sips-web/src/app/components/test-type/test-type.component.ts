import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TestingDataService } from '../../services/testing-data.service';
import { TestTypeService } from '../../services/test-type.service';
import { TestData } from '../../classes/test-data';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ImageUploadDialogComponent } from '../image-upload-dialog/image-upload-dialog.component';


@Component({
  selector: 'app-test-type',
  templateUrl: './test-type.component.html',
  styleUrls: ['./test-type.component.scss']
})
export class TestTypeComponent implements OnInit {
  user: any;
  testType: any;
  testingData: TestData[] = [];

  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  imageUploadDialogRef: MatDialogRef<ImageUploadDialogComponent>;

  constructor(
    private authService: AuthService,
    private testTypeService: TestTypeService,
    private testingDataService: TestingDataService,
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

    this.testTypeService.getTestTypeById(id).subscribe(data => {
      if (data.success) {
        this.testType = data.testType;
        this.loadTestingData(data.testType._id);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  loadTestingData(id) {
    this.testingDataService.getTestingDataForTestType(id).subscribe(data => {
      if (data.success) {
        this.testingDataService.storeTestingData(data.testDataList);
        this.testingData = data.testDataList;
        console.log(data.testDataList);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  onTestingDataClick(testDataId, athleteId) {
    this.router.navigate(['/tests/athlete', athleteId, testDataId]);
    return false;
  }

  onClickEditTestType() {
    this.router.navigate(['/tests/test-types', this.testType._id, 'edit']);
    return false;
  }

  openDeleteTestTypeDialog() {
    this.confirmDialogRef = this.confirmDialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testTypeService.deleteTestType(this.testType._id).subscribe(data => {
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

  openUploadCoverImageDialog() {
    this.imageUploadDialogRef = this.imageUploadDialog.open(ImageUploadDialogComponent, {
      disableClose: false
    });

    this.imageUploadDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.testTypeService.uploadTestTypeImage(this.testType._id, result).subscribe(data => {
          if (data.success) {
            this.flashMessage.show(data.msg, {
              cssClass: 'alert-success',
              timeout: 5000
            });

            this.testType = data.testType;
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

  formatDate(created_at): string {
    return moment(created_at).format('MM/DD/YYYY [at] hh:mmA');
  }

}
