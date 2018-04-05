import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AthleteService } from '../../services/athlete.service';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'app-athlete-profile',
  templateUrl: './athlete-profile.component.html',
  styleUrls: ['./athlete-profile.component.css']
})
export class AthleteProfileComponent implements OnInit {
  athlete: any;
  organization: any;

  constructor(
    private authService: AuthService,
    private athleteService: AthleteService,
    private organizationService: OrganizationService,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.athlete = this.authService.loadUser();
    this.organization = this.athlete.organization.title;
    console.log("Organization: " + this.organization);
  }

}
