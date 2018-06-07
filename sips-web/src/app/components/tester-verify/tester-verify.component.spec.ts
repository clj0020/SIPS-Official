import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTesterComponent } from './verify-tester.component';

describe('VerifyTesterComponent', () => {
  let component: VerifyTesterComponent;
  let fixture: ComponentFixture<VerifyTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
