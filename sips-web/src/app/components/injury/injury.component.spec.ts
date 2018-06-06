import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryComponent } from './injury.component';

describe('InjuryComponent', () => {
  let component: InjuryComponent;
  let fixture: ComponentFixture<InjuryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InjuryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
