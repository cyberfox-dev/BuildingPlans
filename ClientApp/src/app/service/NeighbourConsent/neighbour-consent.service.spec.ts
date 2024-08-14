import { TestBed } from '@angular/core/testing';

import { NeighbourConsentService } from './neighbour-consent.service';

describe('NeighbourConsentService', () => {
  let service: NeighbourConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighbourConsentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
