import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
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
  MatStepperModule
} from '@angular/material';
import { PapaParseModule } from 'ngx-papaparse';

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

// Guards
import { AuthGuard } from './guards/auth.guard';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin/register', component: AdminRegisterComponent },
  { path: 'admin/add-organization', component: AddOrganizationComponent },
  { path: 'admin/organization/:organizationId', component: OrganizationAdminComponent },
  { path: 'testers/verify', component: VerifyTesterComponent },
  { path: 'athletes/verify', component: VerifyAthleteComponent },
  { path: 'athletes/athlete/:id', component: AthleteProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tests/athlete/:athleteId/:id', component: TestDataComponent },
  { path: 'organization/testTypes/add', component: AddTestTypeComponent },
  // {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  // {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  // {path: 'users', component: UserListComponent},
  // {path: 'users/:username', component: UserProfileComponent}
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
    AddTestTypeComponent
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
    BrowserAnimationsModule,
    PapaParseModule
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
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
