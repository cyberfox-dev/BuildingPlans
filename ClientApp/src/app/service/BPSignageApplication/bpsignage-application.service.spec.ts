import { TestBed } from '@angular/core/testing';

import { BPSignageApplicationService } from './bpsignage-application.service';

describe('BPSignageApplicationService', () => {
  let service: BPSignageApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPSignageApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
