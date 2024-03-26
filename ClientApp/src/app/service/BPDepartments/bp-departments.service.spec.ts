import { TestBed } from '@angular/core/testing';

import { BpDepartmentsService } from './bp-departments.service';

describe('BpDepartmentsService', () => {
  let service: BpDepartmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpDepartmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
