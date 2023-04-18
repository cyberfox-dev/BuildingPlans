import { TestBed } from '@angular/core/testing';

import { AccessGroupsService } from './access-groups.service';

describe('AccessGroupsService', () => {
  let service: AccessGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
