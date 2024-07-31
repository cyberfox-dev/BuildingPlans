import { TestBed } from '@angular/core/testing';

import { BpDepartmentForCommentService } from './bp-department-for-comment.service';

describe('BpDepartmentForCommentService', () => {
  let service: BpDepartmentForCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpDepartmentForCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
