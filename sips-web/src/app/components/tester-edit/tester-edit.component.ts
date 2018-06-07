import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TesterService } from '../../services/tester.service';

@Component({
  selector: 'app-tester-edit',
  templateUrl: './tester-edit.component.html',
  styleUrls: ['./tester-edit.component.scss']
})
export class TesterEditComponent implements OnInit {
  user: any;
  tester: any;

  first_name: string;
  last_name: string;
  email: string;
  file: File;

  constructor(
    private authService: AuthService,
    private testerService: TesterService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) {
    this.user = this.authService.loadUser();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.testerService.getTesterById(id).subscribe(data => {
      if (data.success) {
        this.tester = data.tester
        this.first_name = this.tester.first_name;
        this.last_name = this.tester.last_name;
        this.email = this.tester.email;

      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.tester.profileImageUrl = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onTesterEditSubmit() {
    this.tester.first_name = this.first_name;
    this.tester.last_name = this.last_name;
    this.tester.email = this.email;

    this.testerService.editTester(this.tester, this.file).subscribe(data => {
      if (data.success) {
        this.tester = data.tester;

        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 5000
        });

        this.router.navigate(['testers/tester', this.tester._id]);
      }
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    });
  }

}
