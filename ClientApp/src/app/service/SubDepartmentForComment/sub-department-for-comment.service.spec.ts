import { TestBed } from '@angular/core/testing';

import { SubDepartmentForCommentService } from './sub-department-for-comment.service';

describe('SubDepartmentForCommentService', () => {
  let service: SubDepartmentForCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubDepartmentForCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
