import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteEditComponent } from './athlete-edit.component';

describe('AthleteEditComponent', () => {
  let component: AthleteEditComponent;
  let fixture: ComponentFixture<AthleteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
