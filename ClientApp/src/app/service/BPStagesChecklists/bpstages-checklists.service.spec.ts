import { TestBed } from '@angular/core/testing';

import { BPStagesChecklistsService } from './bpstages-checklists.service';

describe('BPStagesChecklistsService', () => {
  let service: BPStagesChecklistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPStagesChecklistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
