import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAttendanceDialogComponent } from './submit-attendance-dialog.component';

describe('SubmitAttendanceDialogComponent', () => {
  let component: SubmitAttendanceDialogComponent;
  let fixture: ComponentFixture<SubmitAttendanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitAttendanceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAttendanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
