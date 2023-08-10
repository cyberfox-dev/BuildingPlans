import { TestBed } from '@angular/core/testing';

import { BpNumberService } from './bp-number.service';

describe('BpNumberService', () => {
  let service: BpNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
