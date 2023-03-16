import { TestBed } from '@angular/core/testing';

import { ZoneForCommentService } from './zone-for-comment.service';

describe('ZoneForCommentService', () => {
  let service: ZoneForCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneForCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
