import { TestBed } from '@angular/core/testing';

import { BPRolesService } from './bproles.service';

describe('BPRolesService', () => {
  let service: BPRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
