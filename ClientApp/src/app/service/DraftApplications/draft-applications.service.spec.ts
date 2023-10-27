import { TestBed } from '@angular/core/testing';

import { DraftApplicationsService } from './draft-applications.service';

describe('DraftApplicationsService', () => {
  let service: DraftApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DraftApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
