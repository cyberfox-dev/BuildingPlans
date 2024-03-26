import { TestBed } from '@angular/core/testing';

import { BPFinancialService } from './bpfinancial.service';

describe('BPFinancialService', () => {
  let service: BPFinancialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPFinancialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
