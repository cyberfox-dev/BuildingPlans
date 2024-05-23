import { TestBed } from '@angular/core/testing';

import { BPFlagApplicationService } from './bpflag-application.service';

describe('BPFlagApplicationService', () => {
  let service: BPFlagApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPFlagApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
