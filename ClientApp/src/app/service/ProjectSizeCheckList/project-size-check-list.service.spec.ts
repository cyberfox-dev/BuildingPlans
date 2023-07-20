import { TestBed } from '@angular/core/testing';

import { ProjectSizeCheckListService } from './project-size-check-list.service';

describe('ProjectSizeCheckListService', () => {
  let service: ProjectSizeCheckListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSizeCheckListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
