import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { CustExtBrowserXhr } from './classes/custom-ext-browser-xhr';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatProgressSpinnerModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatSelectModule,
  MatStepperModule,
  MatDialogModule,
  MatMenuModule,
  MatTabsModule,
  MatGridListModule
} from '@angular/material';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { OrganizationAddComponent } from './components/organization-add/organization-add.component';
import { OrganizationAdminComponent } from './components/organization-admin/organization-admin.component';
import { AthleteVerifyComponent } from './components/athlete-verify/athlete-verify.component';
import { AthleteProfileComponent } from './components/athlete-profile/athlete-profile.component';
import { AthleteEditComponent } from './components/athlete-edit/athlete-edit.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';
import { InjuryAddComponent } from './components/injury-add/injury-add.component';
import { InjuryComponent } from './components/injury/injury.component';
import { InjuryEditComponent } from './components/injury-edit/injury-edit.component';
import { TesterProfileComponent } from './components/tester-profile/tester-profile.component';
import { TesterEditComponent } from './components/tester-edit/tester-edit.component';
import { TesterVerifyComponent } from './components/tester-verify/tester-verify.component';
import { TestDataComponent } from './components/test-data/test-data.component';
import { TestTypeComponent } from './components/test-type/test-type.component';
import { TestTypeAddComponent } from './components/test-type-add/test-type-add.component';
import { TestTypeEditComponent } from './components/test-type-edit/test-type-edit.component';

// Services
import { AuthService } from './services/auth.service';
import { ValidateService } from './services/validate.service';
import { InjuryService } from './services/injury.service';
import { OrganizationService } from './services/organization.service';
import { TesterService } from './services/tester.service';
import { AthleteService } from './services/athlete.service';
import { TestingDataService } from './services/testing-data.service';
import { LoaderService } from './services/loader.service';
import { TestTypeService } from './services/test-type.service';
import { MachineLearnerService } from './services/machine-learner.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/register', component: AdminRegisterComponent },
  { path: 'admin/add-organization', component: OrganizationAddComponent },
  { path: 'admin/organization/:organizationId', component: OrganizationAdminComponent },
  { path: 'athletes/verify', component: AthleteVerifyComponent },
  { path: 'athletes/athlete/:id', component: AthleteProfileComponent },
  { path: 'athletes/athlete/edit/:id', component: AthleteEditComponent },
  { path: 'athletes/injuries/add/:athleteId', component: InjuryAddComponent },
  { path: 'athletes/athlete/:athleteId/injuries/:id', component: InjuryComponent },
  { path: 'athletes/athlete/:athleteId/injuries/:id/edit', component: InjuryEditComponent },
  { path: 'organization/testTypes/add', component: TestTypeAddComponent },
  { path: 'testers/verify', component: TesterVerifyComponent },
  { path: 'testers/tester/:id', component: TesterProfileComponent },
  { path: 'testers/tester/:id/edit', component: TesterEditComponent },
  { path: 'tests/athlete/:athleteId/:id', component: TestDataComponent },
  { path: 'tests/test-types/:id', component: TestTypeComponent },
  { path: 'tests/test-types/:id/edit', component: TestTypeEditComponent }
]


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    AdminRegisterComponent,
    AthleteVerifyComponent,
    AthleteProfileComponent,
    AthleteEditComponent,
    OrganizationAddComponent,
    OrganizationAdminComponent,
    TestDataComponent,
    LoaderComponent,
    LandingPageComponent,
    ConfirmationDialogComponent,
    TestTypeComponent,
    TestTypeAddComponent,
    TestTypeEditComponent,
    InjuryComponent,
    InjuryAddComponent,
    InjuryEditComponent,
    TesterProfileComponent,
    TesterEditComponent,
    TesterVerifyComponent,
    ImageUploadDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlashMessagesModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    ChartsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSelectModule,
    MatStepperModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatGridListModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule
  ],
  providers: [
    AuthService,
    OrganizationService,
    TesterService,
    TestingDataService,
    TestTypeService,
    LoaderService,
    AthleteService,
    InjuryService,
    ValidateService,
    MachineLearnerService,
    AuthGuard,
    { provide: BrowserXhr, useClass: CustExtBrowserXhr }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    ImageUploadDialogComponent
  ]
})
export class AppModule { }
