import { TestBed } from '@angular/core/testing';

import { BPNotificationsService } from './bpnotifications.service';

describe('BPNotificationsService', () => {
  let service: BPNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
