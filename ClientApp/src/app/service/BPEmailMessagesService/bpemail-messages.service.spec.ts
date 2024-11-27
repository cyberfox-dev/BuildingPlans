import { TestBed } from '@angular/core/testing';

import { BPEmailMessagesService } from './bpemail-messages.service';

describe('BPEmailMessagesService', () => {
  let service: BPEmailMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPEmailMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
