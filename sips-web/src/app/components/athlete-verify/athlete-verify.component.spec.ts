import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAthleteComponent } from './verify-athlete.component';

describe('VerifyAthleteComponent', () => {
  let component: VerifyAthleteComponent;
  let fixture: ComponentFixture<VerifyAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyAthleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
