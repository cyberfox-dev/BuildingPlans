import { TestBed } from '@angular/core/testing';

import { ReviewerforcommentService } from './reviewerforcomment.service';

describe('ReviewerforcommentService', () => {
  let service: ReviewerforcommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewerforcommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
