import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAthleteDialogComponent } from './delete-athlete-dialog.component';

describe('DeleteAthleteDialogComponent', () => {
  let component: DeleteAthleteDialogComponent;
  let fixture: ComponentFixture<DeleteAthleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAthleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAthleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
