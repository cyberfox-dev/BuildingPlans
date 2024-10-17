import { TestBed } from '@angular/core/testing';

import { BPApplicationChecklistService } from './bpapplication-checklist.service';

describe('BPApplicationChecklistService', () => {
  let service: BPApplicationChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPApplicationChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
