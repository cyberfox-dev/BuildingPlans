import { TestBed } from '@angular/core/testing';

import { BPAccessGroupRoleLinkService } from './bpaccess-group-role-link.service';

describe('BPAccessGroupRoleLinkService', () => {
  let service: BPAccessGroupRoleLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPAccessGroupRoleLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
