import { TestBed } from '@angular/core/testing';

import { BPAccessGroupUserLinkService } from './bpaccess-group-user-link.service';

describe('BPAccessGroupUserLinkService', () => {
  let service: BPAccessGroupUserLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPAccessGroupUserLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
