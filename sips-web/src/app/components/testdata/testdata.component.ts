import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Organization } from '../../classes/organization';
import { OrganizationService } from '../../services/organization.service';
import { TesterService } from '../../services/tester.service';
import { AthleteService } from '../../services/athlete.service';
import { TestingDataService } from '../../services/testing-data.service';

@Component({
  selector: 'app-testdata',
  templateUrl: './testdata.component.html',
  styleUrls: ['./testdata.component.css']
})
export class TestDataComponent implements OnInit {

  testData: any;
  testType: any;

  // Accelerometer Data
  accelerometer_time: Array<any> = [];
  accelerometer_x: Array<any> = [];
  accelerometer_y: Array<any> = [];
  accelerometer_z: Array<any> = [];

  accelerometerLineChartLabels: Array<any> = this.accelerometer_time;
  accelerometerLineChartData: Array<any> = [
    { data: this.accelerometer_x, label: 'X-Axis' },
    { data: this.accelerometer_y, label: 'Y-Axis' },
    { data: this.accelerometer_z, label: 'Z-Axis' }
  ];

  accelerometerLineChartOptions: any = {
    title: {
      display: true,
      text: "Accelerometer Data",
      fontSize: 25
    },
    responsive: true,
    legend: {
      display: true,
      position: 'bottom'
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time (ms)'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sensor Value'
        }
      }],
    }
  };

  // Gyroscope Data
  gyroscope_time: Array<any> = [];
  gyroscope_x: Array<any> = [];
  gyroscope_y: Array<any> = [];
  gyroscope_z: Array<any> = [];

  gyroscopeLineChartLabels: Array<any> = this.gyroscope_time;
  gyroscopeLineChartData: Array<any> = [
    { data: this.gyroscope_x, label: 'X-Axis' },
    { data: this.gyroscope_y, label: 'Y-Axis' },
    { data: this.gyroscope_z, label: 'Z-Axis' }
  ];

  gyroscopeLineChartOptions: any = {
    title: {
      display: true,
      text: "Gyroscope Data",
      fontSize: 25
    },
    responsive: true,
    legend: {
      display: true,
      position: 'bottom'
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time (ms)'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sensor Value'
        }
      }],
    }
  }

  // Magnometer Data
  magnometer_time: Array<any> = [];
  magnometer_x: Array<any> = [];
  magnometer_y: Array<any> = [];
  magnometer_z: Array<any> = [];

  magnometerLineChartLabels: Array<any> = this.magnometer_time;
  magnometerLineChartData: Array<any> = [
    { data: this.magnometer_x, label: 'X-Axis' },
    { data: this.magnometer_y, label: 'Y-Axis' },
    { data: this.magnometer_z, label: 'Z-Axis' }
  ];

  magnometerLineChartOptions: any = {
    title: {
      display: true,
      text: "Magnometer Data",
      fontSize: 25
    },
    responsive: true,
    legend: {
      display: true,
      position: 'bottom'
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time (ms)'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sensor Value'
        }
      }],
    }
  }

  lineChartLegend: boolean = true;
  lineChartType: string = 'line';
  lineChartColors: Array<any> = [
    { // red for x-axis
      backgroundColor: 'rgba(255,51,51,0.2)',
      borderColor: 'rgba(255,51,51,1)',
      pointBackgroundColor: 'rgba(255,51,51,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,51,51,0.8)'
    },
    { // green for y-axis
      backgroundColor: 'rgba(0,204,0,0.2)',
      borderColor: 'rgba(0,204,0,1)',
      pointBackgroundColor: 'rgba(0,204,0,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,204,0,1)'
    },
    { // blue for z-axis
      backgroundColor: 'rgba(51,51,255,0.2)',
      borderColor: 'rgba(51,51,255,1)',
      pointBackgroundColor: 'rgba(51,51,255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(51,51,255,0.8)'
    }
  ];

  constructor(
    private authService: AuthService,
    private organizationService: OrganizationService,
    private testerService: TesterService,
    private athleteService: AthleteService,
    private testingDataService: TestingDataService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    let athleteId = this.route.snapshot.paramMap.get('athleteId');

    this.testingDataService.getTestDataById(id, athleteId).subscribe(data => {
      if (data.success) {
        this.testData = data.testData;
        this.testType = data.testData.testType;

        for (var i = 0; i < this.testData.accelerometer_data.length; i++) {
          this.accelerometer_time.push(this.testData.accelerometer_data[i].time);
          this.accelerometer_x.push(this.testData.accelerometer_data[i].x);
          this.accelerometer_y.push(this.testData.accelerometer_data[i].y);
          this.accelerometer_z.push(this.testData.accelerometer_data[i].z);
        }

        for (var i = 0; i < this.testData.gyroscope_data.length; i++) {
          this.gyroscope_time.push(this.testData.gyroscope_data[i].time);
          this.gyroscope_x.push(this.testData.gyroscope_data[i].x);
          this.gyroscope_y.push(this.testData.gyroscope_data[i].y);
          this.gyroscope_z.push(this.testData.gyroscope_data[i].z);
        }

        for (var i = 0; i < this.testData.magnometer_data.length; i++) {
          this.magnometer_time.push(this.testData.magnometer_data[i].time);
          this.magnometer_x.push(this.testData.magnometer_data[i].x);
          this.magnometer_y.push(this.testData.magnometer_data[i].y);
          this.magnometer_z.push(this.testData.magnometer_data[i].z);
        }
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  formatDate(created_at): string {
    // return ISODate(created_at).toLocaleTimeString();
    // moment(created_at, "YYYY-MM-DD HH:mm:ss.")
    return moment(created_at).format('MM/DD/YYYY hh:mmA');
  }

  onClickDownloadCSV() {
    // console.log(this.testData);
    //
    // let options = {
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalseparator: '.',
    //   showLabels: true,
    //   showTitle: true,
    //   title: this.testData._id,
    //   // useBom: true,
    //   noDownload: false,
    //   // headers: ["First Name", "Last Name", "ID"]
    // };
    //
    // let fileName = "testid_" + this.testData._id + "_data_file"
    //
    // var csv = new Angular5Csv(this.testData, fileName, options);
    // console.log(csv);
  }

}
