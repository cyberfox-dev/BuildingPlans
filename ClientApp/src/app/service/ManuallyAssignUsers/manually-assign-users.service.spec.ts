import { TestBed } from '@angular/core/testing';

import { ManuallyAssignUsersService } from './manually-assign-users.service';

describe('ManuallyAssignUsersService', () => {
  let service: ManuallyAssignUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManuallyAssignUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
