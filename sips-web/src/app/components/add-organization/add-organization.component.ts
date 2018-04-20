import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { OrganizationService } from '../../services/organization.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.css']
})
export class AddOrganizationComponent implements OnInit {
  title: string;

  constructor(
    private validateService: ValidateService,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onAddOrganizationSubmit() {

    const organization = {
      title: this.title
    }

    // Required Fields
    if (!this.validateService.validateAddOrganization(organization)) {
      this.flashMessage.show('Please fill in all fields!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // Register User
    this.organizationService.addOrganization(organization).subscribe(data => {
      if (data.success) {

        var user = data.user;
        user.organization = data.organization;
        console.log("Organization succesfully added, updated user object with ref..");
        console.log(user);
        this.authService.setUser(user);
        this.authService.setToken(data.token);
        this.organizationService.storeOrganization(data.organization);
        // this.authService.setToken(data.token);
        // this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('Successfully Added Organization!', { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/admin/organization', data.organization._id]);
      }
      else {
        console.log(data);
        this.flashMessage.show('Something went wrong!', { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/add-organization']);
      }
    });

  }

}
