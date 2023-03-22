import { TestBed } from '@angular/core/testing';

import { DepositRequiredService } from './deposit-required.service';

describe('DepositRequiredService', () => {
  let service: DepositRequiredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepositRequiredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
