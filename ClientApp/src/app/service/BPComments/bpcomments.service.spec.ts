import { TestBed } from '@angular/core/testing';

import { BPCommentsService } from './bpcomments.service';

describe('BPCommentsService', () => {
  let service: BPCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
