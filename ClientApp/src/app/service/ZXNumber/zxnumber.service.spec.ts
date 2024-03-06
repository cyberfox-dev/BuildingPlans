import { TestBed } from '@angular/core/testing';

import { ZXNumberService } from './zxnumber.service';

describe('ZXNumberService', () => {
  let service: ZXNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZXNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
