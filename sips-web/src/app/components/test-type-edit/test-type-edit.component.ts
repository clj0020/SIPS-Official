import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TestTypeService } from '../../services/test-type.service';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-test-type-edit',
  templateUrl: './test-type-edit.component.html',
  styleUrls: ['./test-type-edit.component.scss']
})
export class TestTypeEditComponent implements OnInit {
  user: any;
  testType: any;

  title: string;
  description: string;
  duration: number;
  file: File;

  constructor(
    private authService: AuthService,
    private testTypeService: TestTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private dialog: MatDialog
  ) {
    this.user = this.authService.loadUser();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.testTypeService.getTestTypeById(id).subscribe(data => {
      if (data.success) {
        this.testType = data.testType;
        this.title = this.testType.title;
        this.description = this.testType.description;
        this.duration = this.testType.duration;
        this.file = this.testType.imageUrl;
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
        this.testType.imageUrl = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onTestTypeEditSubmit() {
    this.testType.title = this.title;
    this.testType.description = this.description;
    this.testType.duration = this.testType.duration;

    this.testTypeService.editTestType(this.testType, this.file).subscribe(data => {
      if (data.success) {
        this.testType = data.testType;

        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 5000
        });

        this.router.navigate(['tests/test-types', this.testType._id]);
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
