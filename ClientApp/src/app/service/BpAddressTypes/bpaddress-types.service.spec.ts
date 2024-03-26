import { TestBed } from '@angular/core/testing';

import { BPAddressTypesService } from './bpaddress-types.service';

describe('BPAddressTypesService', () => {
  let service: BPAddressTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPAddressTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
