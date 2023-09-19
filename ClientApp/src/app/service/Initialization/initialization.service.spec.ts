import { TestBed } from '@angular/core/testing';

import { InitilizationService } from './initilization.service';

describe('InitilizationService', () => {
  let service: InitilizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitilizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
