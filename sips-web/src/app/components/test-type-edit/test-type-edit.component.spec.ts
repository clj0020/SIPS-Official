import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTypeEditComponent } from './test-type-edit.component';

describe('TestTypeEditComponent', () => {
  let component: TestTypeEditComponent;
  let fixture: ComponentFixture<TestTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
