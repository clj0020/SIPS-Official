import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { TestTypeService } from '../../services/test-type.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-test-type',
  templateUrl: './add-test-type.component.html',
  styleUrls: ['./add-test-type.component.css']
})
export class AddTestTypeComponent implements OnInit {
  title: string;
  description: string;
  duration: string;


  constructor(
    private validateService: ValidateService,
    private testTypeService: TestTypeService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onAddTestTypeSubmit() {

    const testType = {
      title: this.title,
      description: this.description,
      duration: this.duration
    }

    if (!this.validateService.validateAddTestType(testType)) {
      this.flashMessage.show('Please fill in all fields!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    this.testTypeService.addTestType(testType).subscribe(data => {
      if (data.success) {
        console.log("Test Type successfully added..");
        console.log(data);

        this.flashMessage.show('Successfully Added Test Type!', { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/admin/organization', data.testType.organization]);
      }
      else {
        this.flashMessage.show('Something went wrong!', { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/organization/testTypes/add']);
      }

    });


  }

}
