import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProfileComponent } from './athlete-profile.component';

describe('AthleteProfileComponent', () => {
  let component: AthleteProfileComponent;
  let fixture: ComponentFixture<AthleteProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
