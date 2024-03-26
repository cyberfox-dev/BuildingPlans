import { TestBed } from '@angular/core/testing';

import { BPDepartmentLinkService } from './bpdepartment-link.service';

describe('BPDepartmentLinkService', () => {
  let service: BPDepartmentLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPDepartmentLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
