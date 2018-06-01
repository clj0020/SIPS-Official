import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Organization } from '../../classes/organization';
import { OrganizationService } from '../../services/organization.service';
import { TesterService } from '../../services/tester.service';
import { AthleteService } from '../../services/athlete.service';
import { TestTypeService } from '../../services/test-type.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-organization-admin',
  templateUrl: './organization-admin.component.html',
  styleUrls: ['./organization-admin.component.scss']
})
export class OrganizationAdminComponent implements OnInit {
  organization: Organization;
  testerEmail: string;
  testers: any[] = [];

  athleteEmail: string;
  athletes: any[] = [];

  testTypes: any[] = [];

  organizationId: string;


  constructor(
    private authService: AuthService,
    private organizationService: OrganizationService,
    private testerService: TesterService,
    private athleteService: AthleteService,
    private testTypeService: TestTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) {

  }

  ngOnInit() {
    this.organizationId = this.route.snapshot.paramMap.get('organizationId');
    this.loadOrganization(this.organizationId);
  }

  onTesterAdded() {
    this.testerService.addTester({ email: this.testerEmail, organization: this.organizationId }).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Successfully sent tester confirmation email!', {
          cssClass: 'alert-success',
          timeout: 5000
        });
        this.testers.push(data.tester);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
    this.testerEmail = '';
  }

  onAthleteAdded() {
    this.athleteService.addAthlete({ email: this.athleteEmail, organization: this.organizationId }).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Successfully sent athlete confirmation email!', {
          cssClass: 'alert-success',
          timeout: 5000
        });
        this.athletes.push(data.athlete);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
    this.athleteEmail = '';
  }

  loadOrganization(organizationId) {
    this.organizationService.getOrganization(organizationId).subscribe(data => {
      if (data.success) {
        this.organizationService.storeOrganization(data.organization);
        this.organization = data.organization;
        this.loadTesters(this.organization._id);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  loadAthletes(organizationId) {
    this.athleteService.getAthletesFromOrganization(organizationId).subscribe(data => {
      if (data.success) {
        this.athleteService.storeAthletes(data.athletes);
        this.athletes = data.athletes;
        this.loadTestTypes(this.organization._id);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  loadTesters(organizationId) {
    this.testerService.getTestersFromOrganization(organizationId).subscribe(data => {
      if (data.success) {
        this.testerService.storeTesters(data.testers);
        this.testers = data.testers;
        this.loadAthletes(this.organization._id);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  loadTestTypes(organizationId) {
    this.testTypeService.getTestTypesFromOrganization(organizationId).subscribe(data => {
      if (data.success) {
        this.testTypeService.storeTestTypes(data.testTypes);
        this.testTypes = data.testTypes;
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  onAthleteClick(id) {
    this.router.navigate(['/athletes/athlete', id]);
    return false;
  }

  onTesterClick(id) {
    this.router.navigate(['testers/tester', id]);
    return false;
  }

  onAddTestTypeClicked() {
    this.router.navigate(['organization/testTypes/add']);
    return false;
  }

}
