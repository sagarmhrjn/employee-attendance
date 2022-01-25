import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceFormDailogComponent } from './attendance-form-dailog.component';

describe('AttendanceFormDailogComponent', () => {
  let component: AttendanceFormDailogComponent;
  let fixture: ComponentFixture<AttendanceFormDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceFormDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceFormDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
