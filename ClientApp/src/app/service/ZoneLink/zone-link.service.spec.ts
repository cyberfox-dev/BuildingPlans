import { TestBed } from '@angular/core/testing';

import { ZoneLinkService } from './zone-link.service';

describe('ZoneLinkService', () => {
  let service: ZoneLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
