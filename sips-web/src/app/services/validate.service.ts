import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if (user.first_name == undefined || user.last_name == undefined ||
      user.email == undefined || user.password == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validateLogin(user) {
    if (user.email == undefined || user.password == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validateAddOrganization(organization) {
    if (organization.title == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validateAddTestType(testType) {
    if (testType.title == undefined || testType.description == undefined ||
      testType.duration == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validateTesterVerification(tester) {
    if (tester.first_name == undefined || tester.last_name == undefined ||
      tester.password == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validateAthleteVerification(athlete) {
    if (athlete.first_name == undefined || athlete.last_name == undefined ||
      athlete.date_of_birth == undefined || athlete.height == undefined ||
      athlete.weight == undefined || athlete.password == undefined ||
      athlete.sport == undefined || athlete.position == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validatePasswordMatch(password, confirmPassword) {
    if (!password === confirmPassword) {
      return false;
    }
    else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
