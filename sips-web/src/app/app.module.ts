import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { AddOrganizationComponent } from './components/add-organization/add-organization.component';
import { OrganizationAdminComponent } from './components/organization-admin/organization-admin.component';
import { VerifyTesterComponent } from './components/verify-tester/verify-tester.component';

// Services
import { AuthService } from './services/auth.service';
import { ValidateService } from './services/validate.service';
import { OrganizationService } from './services/organization.service';
import { TesterService } from './services/tester.service';
import { AthleteService } from './services/athlete.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { VerifyAthleteComponent } from './components/verify-athlete/verify-athlete.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/register', component: AdminRegisterComponent },
  { path: 'admin/add-organization', component: AddOrganizationComponent },
  { path: 'admin/organization/:organizationId', component: OrganizationAdminComponent },
  { path: 'testers/verify', component: VerifyTesterComponent },
  { path: 'athletes/verify', component: VerifyAthleteComponent },
  { path: 'login', component: LoginComponent },

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
    RegisterComponent,
    NavbarComponent,
    ProfileComponent,
    AdminRegisterComponent,
    AddOrganizationComponent,
    OrganizationAdminComponent,
    VerifyTesterComponent,
    VerifyAthleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    OrganizationService,
    TesterService,
    AthleteService,
    ValidateService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
