import { TestBed } from '@angular/core/testing';

import { BPBannerApplicationService } from './bpbanner-application.service';

describe('BPBannerApplicationService', () => {
  let service: BPBannerApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPBannerApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
