import { TestBed } from '@angular/core/testing';

import { BPAccessGroupsService } from './bpaccess-groups.service';

describe('BPAccessGroupsService', () => {
  let service: BPAccessGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPAccessGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
