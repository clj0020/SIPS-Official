import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AthleteService } from '../../services/athlete.service';
import { OrganizationService } from '../../services/organization.service';
import { InjuryService } from '../../services/injury.service';
import { TestingDataService } from '../../services/testing-data.service';
import { Injury } from '../../classes/injury';
import { TestData } from '../../classes/test-data';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-athlete-profile',
  templateUrl: './athlete-profile.component.html',
  styleUrls: ['./athlete-profile.component.css']
})
export class AthleteProfileComponent implements OnInit {
  user: any;
  athlete: any;
  organization: any;
  testingData: TestData[] = [];
  injuries: Injury[] = [];

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private authService: AuthService,
    private athleteService: AthleteService,
    private injuryService: InjuryService,
    private organizationService: OrganizationService,
    private testingDataService: TestingDataService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private dialog: MatDialog
  ) {
    this.user = this.authService.loadUser();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.athleteService.getAthleteById(id).subscribe(data => {
      if (data.success) {
        this.athlete = data.athlete;
        this.loadOrganization(data.athlete.organization);
        this.loadTestingData(data.athlete._id);
        this.loadInjuries(data.athlete._id);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });

  }

  loadOrganization(organizationId) {
    this.organizationService.getOrganization(organizationId).subscribe(data => {
      if (data.success) {
        this.organizationService.storeOrganization(data.organization);
        this.organization = data.organization;
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  loadTestingData(athleteId) {
    this.testingDataService.getTestingDataForAthlete(athleteId).subscribe(data => {
      if (data.success) {
        this.testingDataService.storeTestingData(data.testDataList);
        this.testingData = data.testDataList;
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
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

  openDeleteAthleteDialog() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.athleteService.deleteAthlete(this.athlete._id).subscribe(data => {
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

  openResendConfirmationEmailDialog() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Resend confirmation email?"

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.athleteService.resendAthleteVerificationEmail(this.athlete._id).subscribe(data => {
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

  onClickDownloadCSV() {
    var data = [];
    for (var i = 0; i < this.testingData.length; i++) {
      for (var j = 0; j < this.testingData[i].accelerometer_data.length; j++) {
        data.push({
          created_at: this.testingData[i].created_at,
          sensor_type: "accelerometer",
          test_id: this.testingData[i]._id,
          athlete_id: this.testingData[i].athlete,
          time: this.testingData[i].accelerometer_data[j].time,
          x: this.testingData[i].accelerometer_data[j].x,
          y: this.testingData[i].accelerometer_data[j].y,
          z: this.testingData[i].accelerometer_data[j].z,
        });
      }
      for (var j = 0; j < this.testingData[i].gyroscope_data.length; j++) {
        data.push({
          created_at: this.testingData[i].created_at,
          sensor_type: "gyroscope",
          test_id: this.testingData[i]._id,
          athlete_id: this.testingData[i].athlete,
          time: this.testingData[i].gyroscope_data[j].time,
          x: this.testingData[i].gyroscope_data[j].x,
          y: this.testingData[i].gyroscope_data[j].y,
          z: this.testingData[i].gyroscope_data[j].z,
        });
      }
      for (var j = 0; j < this.testingData[i].magnometer_data.length; j++) {
        data.push({
          created_at: this.testingData[i].created_at,
          sensor_type: "magnometer",
          test_id: this.testingData[i]._id,
          athlete_id: this.testingData[i].athlete,
          time: this.testingData[i].magnometer_data[j].time,
          x: this.testingData[i].magnometer_data[j].x,
          y: this.testingData[i].magnometer_data[j].y,
          z: this.testingData[i].magnometer_data[j].z,
        });
      }
    }
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: ["created_at", "sensor_type", "test_id", "athlete_id", "time", "x", "y", "z"]
    };
    let csv_title = 'athlete_' + this.athlete._id + "_testing_data"
    new Angular5Csv(data, csv_title, options);
  }

  onTestingDataClick(testDataId) {
    this.router.navigate(['/tests/athlete', this.athlete._id, testDataId]);
    return false;
  }

  formatDate(created_at): string {
    return moment(created_at).format('MM/DD/YYYY [at] hh:mmA');
  }

  formatBirthday(birthdayDate): string {
    return moment(birthdayDate).format('MMMM Do, YYYY');
  }
}
