import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrganizationService } from '../../services/organization.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../classes/user';
import { Organization } from '../../classes/organization';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private authService: AuthService,
    private organizationService: OrganizationService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {
    this.user = authService.loadUser();

    if (this.user.kind == "Admin") {
      console.log("Admin User found in HomeConstructor");
      console.log(this.user.organization);

      if (this.user.organization !== undefined) {
        this.router.navigate(['/admin/organization', this.user.organization._id]);
      }
      else {
        this.router.navigate(['/admin/add-organization']);
      }
    }
  }

  ngOnInit() {
    this.authService.userEmitter.subscribe(user => {
      this.user = user;

      if (this.user.kind == "Admin") {
        console.log("Admin User found in HomeEmitter..");
        console.log(this.user.organization);
        if (this.user.organization !== undefined) {
          this.router.navigate(['/admin/organization', this.user.organization._id]);
        }
        else {
          this.router.navigate(['/admin/add-organization']);
        }
      }

    });
  }


}
