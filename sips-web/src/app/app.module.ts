import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
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
  MatDialogModule
} from '@angular/material';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { AddOrganizationComponent } from './components/add-organization/add-organization.component';
import { OrganizationAdminComponent } from './components/organization-admin/organization-admin.component';
import { VerifyTesterComponent } from './components/verify-tester/verify-tester.component';
import { VerifyAthleteComponent } from './components/verify-athlete/verify-athlete.component';
import { AthleteProfileComponent } from './components/athlete-profile/athlete-profile.component';
import { TestDataComponent } from './components/testdata/testdata.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AddTestTypeComponent } from './components/add-test-type/add-test-type.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TesterProfileComponent } from './components/tester-profile/tester-profile.component';
import { AddInjuryComponent } from './components/add-injury/add-injury.component';

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
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin/register', component: AdminRegisterComponent },
  { path: 'admin/add-organization', component: AddOrganizationComponent },
  { path: 'admin/organization/:organizationId', component: OrganizationAdminComponent },
  { path: 'testers/verify', component: VerifyTesterComponent },
  { path: 'athletes/verify', component: VerifyAthleteComponent },
  { path: 'athletes/athlete/:id', component: AthleteProfileComponent },
  { path: 'testers/tester/:id', component: TesterProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tests/athlete/:athleteId/:id', component: TestDataComponent },
  { path: 'organization/testTypes/add', component: AddTestTypeComponent },
  { path: 'athletes/injuries/add/:athleteId', component: AddInjuryComponent }
]


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    AdminRegisterComponent,
    AddOrganizationComponent,
    OrganizationAdminComponent,
    VerifyTesterComponent,
    VerifyAthleteComponent,
    AthleteProfileComponent,
    TestDataComponent,
    LoaderComponent,
    AddTestTypeComponent,
    LandingPageComponent,
    FooterComponent,
    ConfirmationDialogComponent,
    TesterProfileComponent,
    AddInjuryComponent
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
    AuthGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class AppModule { }
