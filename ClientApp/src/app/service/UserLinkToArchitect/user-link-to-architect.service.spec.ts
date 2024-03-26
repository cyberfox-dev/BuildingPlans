import { TestBed } from '@angular/core/testing';

import { UserLinkToArchitectService } from './user-link-to-architect.service';

describe('UserLinkToArchitectService', () => {
  let service: UserLinkToArchitectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLinkToArchitectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
