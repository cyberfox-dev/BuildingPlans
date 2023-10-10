import { TestBed } from '@angular/core/testing';

import { ProjectSizedSelectionService } from './project-sized-selection.service';

describe('ProjectSizedSelectionService', () => {
  let service: ProjectSizedSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSizedSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
