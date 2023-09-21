import { TestBed } from '@angular/core/testing';

import { InitializationService } from './initialization.service';

describe('InitilizationService', () => {
  let service: InitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
