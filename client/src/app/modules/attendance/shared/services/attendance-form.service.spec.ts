import { TestBed } from '@angular/core/testing';

import { AttendanceFormService } from './attendance-form.service';

describe('AttendanceFormService', () => {
  let service: AttendanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
