import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Organization } from '../../classes/organization';
import { OrganizationService } from '../../services/organization.service';
import { TesterService } from '../../services/tester.service';
import { AthleteService } from '../../services/athlete.service';

@Component({
  selector: 'app-organization-admin',
  templateUrl: './organization-admin.component.html',
  styleUrls: ['./organization-admin.component.css']
})
export class OrganizationAdminComponent implements OnInit {
  organization: Organization;
  testerEmail: string;
  testers: any[] = [];

  athleteEmail: string;
  athletes: any[] = [];

  @Input() organizationId: string;


  constructor(
    private authService: AuthService,
    private organizationService: OrganizationService,
    private testerService: TesterService,
    private athleteService: AthleteService,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.loadOrganization(this.organizationId);
    this.loadAthletes(this.organizationId);
    this.loadTesters(this.organizationId);
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
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  onAddOrganizationClick() {
    this.router.navigate(['/admin/add-organization']);
    return false;
  }

}
