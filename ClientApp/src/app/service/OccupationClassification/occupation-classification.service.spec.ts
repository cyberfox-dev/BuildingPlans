import { TestBed } from '@angular/core/testing';

import { OccupationClassificationService } from './occupation-classification.service';

describe('OccupationClassificationService', () => {
  let service: OccupationClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OccupationClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
