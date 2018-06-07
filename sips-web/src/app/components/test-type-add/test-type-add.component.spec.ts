import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestTypeComponent } from './add-test-type.component';

describe('AddTestTypeComponent', () => {
  let component: AddTestTypeComponent;
  let fixture: ComponentFixture<AddTestTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTestTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
