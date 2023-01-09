import { TestBed } from '@angular/core/testing';

import { CommentBuilderService } from './comment-builder.service';

describe('CommentBuilderService', () => {
  let service: CommentBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
