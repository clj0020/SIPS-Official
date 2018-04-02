import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TesterService } from '../../services/tester.service';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-verify-tester',
  templateUrl: './verify-tester.component.html',
  styleUrls: ['./verify-tester.component.css']
})
export class VerifyTesterComponent implements OnInit, OnDestroy {
  token: string;
  // private subscription: any;

  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private testerService: TesterService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.token)
      .subscribe(params => {
        console.log(params);
        this.token = params.token;
        console.log(this.token);
        this.authService.setToken(this.token);
      });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  onVerifySubmit() {
    const tester = {
      first_name: this.first_name,
      last_name: this.last_name,
      password: this.password
    }


    if (!this.validateService.validateTesterVerification(tester)) {
      this.flashMessage.show('Please fill in all fields!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    if (!this.validateService.validatePasswordMatch(this.password, this.confirm_password)) {
      this.flashMessage.show('Passwords do not match!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    this.testerService.verifyTester(tester).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Successfully verified!', {
          cssClass: 'alert-success',
          timeout: 5000
        });

        this.authService.storeUserData(data.token, data.tester);
        this.router.navigate(['/']);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    })
  }

}
