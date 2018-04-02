import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Organization } from '../../classes/organization';
import { OrganizationService } from '../../services/organization.service';
import { TesterService } from '../../services/tester.service';


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
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
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
        // 
        // this.testerService.sendConfirmationEmail(data.tester).subscribe(confirmationData => {
        //   if (confirmationData.success) {
        //     this.flashMessage.show('Successfully sent tester confirmation email!', {
        //       cssClass: 'alert-success',
        //       timeout: 5000
        //     });
        //     this.testers.push({ email: this.testerEmail, status: 'Email sent.' });
        //   }
        //   else {
        //     this.flashMessage.show(confirmationData.msg, {
        //       cssClass: 'alert-danger',
        //       timeout: 5000
        //     });
        //   }
        // });
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
    this.athletes.push({ email: this.athleteEmail, status: 'Not Emailed.' });
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

  onAddOrganizationClick() {
    this.router.navigate(['/admin/add-organization']);
    return false;
  }

}
