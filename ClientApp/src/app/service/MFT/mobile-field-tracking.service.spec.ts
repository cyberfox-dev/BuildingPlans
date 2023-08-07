import { TestBed } from '@angular/core/testing';

import { MobileFieldTrackingService } from './mobile-field-tracking.service';

describe('MobileFieldTrackingService', () => {
  let service: MobileFieldTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileFieldTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
