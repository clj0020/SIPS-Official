import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TesterProfileComponent } from './tester-profile.component';

describe('TesterProfileComponent', () => {
  let component: TesterProfileComponent;
  let fixture: ComponentFixture<TesterProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TesterProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
