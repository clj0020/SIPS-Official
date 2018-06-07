import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TesterEditComponent } from './tester-edit.component';

describe('TesterEditComponent', () => {
  let component: TesterEditComponent;
  let fixture: ComponentFixture<TesterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TesterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
