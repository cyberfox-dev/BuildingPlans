import { TestBed } from '@angular/core/testing';

import { BuildingApplicationsService } from './building-applications.service';

describe('BuildingApplicationsService', () => {
  let service: BuildingApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
