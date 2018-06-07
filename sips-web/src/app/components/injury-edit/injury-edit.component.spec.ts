import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryEditComponent } from './injury-edit.component';

describe('InjuryEditComponent', () => {
  let component: InjuryEditComponent;
  let fixture: ComponentFixture<InjuryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InjuryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
