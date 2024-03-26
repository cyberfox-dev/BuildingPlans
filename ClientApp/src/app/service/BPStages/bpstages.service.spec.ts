import { TestBed } from '@angular/core/testing';

import { BPStagesService } from './bpstages.service';

describe('BPStagesService', () => {
  let service: BPStagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPStagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
