import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AthleteService } from '../../services/athlete.service';
import { OrganizationService } from '../../services/organization.service';
import { TestingDataService } from '../../services/testing-data.service';

@Component({
  selector: 'app-athlete-profile',
  templateUrl: './athlete-profile.component.html',
  styleUrls: ['./athlete-profile.component.css']
})
export class AthleteProfileComponent implements OnInit {
  athlete: any;
  organization: any;
  testingData: any[] = [];

  constructor(
    private authService: AuthService,
    private athleteService: AthleteService,
    private organizationService: OrganizationService,
    private testingDataService: TestingDataService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    // this.athlete = this.authService.loadUser();
    this.athleteService.getAthleteById(id).subscribe(data => {
      if (data.success) {
        this.athlete = data.athlete;
        this.loadOrganization(data.athlete.organization);
        this.loadTestingData(data.athlete._id);
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
        console.log(data)
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

  onTestingDataClick(testDataId) {
    this.router.navigate(['/tests/athlete', this.athlete._id, testDataId]);
    return false;
  }

  formatDate(created_at): string {
    // return ISODate(created_at).toLocaleTimeString();
    // moment(created_at, "YYYY-MM-DD HH:mm:ss.")
    return moment(created_at).format('MM/DD/YYYY [at] hh:mmA');
  }

  formatBirthday(birthdayDate): string {
    return moment(birthdayDate).format('MMMM Do, YYYY');
  }

}
