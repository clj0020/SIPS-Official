import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;


  constructor(
    private authService: AuthService,
    private validateService: ValidateService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };

    if (!this.validateService.validateLogin(user)) {
      this.flashMessage.show('Please fill in all fields!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Invalid email!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        console.log(data);
        this.authService.setUser(data.user);
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('You are now logged in!', {
          cssClass: 'alert-success',
          timeout: 5000
        });

        this.router.navigate(['/']);
      }
      else {
        this.flashMessage.show(data.msg.error, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
        this.router.navigate(['/login']);
      }
    });
  }

}
