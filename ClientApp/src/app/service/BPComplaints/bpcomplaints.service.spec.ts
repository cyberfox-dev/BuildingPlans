import { TestBed } from '@angular/core/testing';

import { BPComplaintsService } from './bpcomplaints.service';

describe('BPComplaintsService', () => {
  let service: BPComplaintsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPComplaintsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
