import { TestBed } from '@angular/core/testing';

import { AccessGroupUserLinkServiceService } from './access-group-user-link-service.service';

describe('AccessGroupUserLinkServiceService', () => {
  let service: AccessGroupUserLinkServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessGroupUserLinkServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
