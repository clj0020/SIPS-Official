import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss']
})
export class AdminRegisterComponent implements OnInit {
  first_name: string;
  last_name: string;
  email: string;
  password: string;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password
    }


    // Required Fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valid email address!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // Register Admin
    this.authService.registerAdmin(user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('You are now registered and can log in now!', { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      }
      else {
        this.flashMessage.show('Something went wrong!', { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/admin/register']);
      }
    });

  }

}
