import { TestBed } from '@angular/core/testing';

import { BPDepartmentChecklistsService } from './bpdepartment-checklists.service';

describe('BPDepartmentChecklistsService', () => {
  let service: BPDepartmentChecklistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPDepartmentChecklistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
