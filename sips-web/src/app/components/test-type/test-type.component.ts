import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TestingDataService } from '../../services/testing-data.service';
import { TestTypeService } from '../../services/test-type.service';
import { TestData } from '../../classes/test-data';

@Component({
  selector: 'app-test-type',
  templateUrl: './test-type.component.html',
  styleUrls: ['./test-type.component.scss']
})
export class TestTypeComponent implements OnInit {
  user: any;
  testType: any;
  testingData: TestData[] = [];

  constructor(
    private authService: AuthService,
    private testTypeService: TestTypeService,
    private testingDataService: TestingDataService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
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

  formatDate(created_at): string {
    return moment(created_at).format('MM/DD/YYYY [at] hh:mmA');
  }

}
