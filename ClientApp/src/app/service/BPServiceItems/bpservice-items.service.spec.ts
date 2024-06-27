import { TestBed } from '@angular/core/testing';

import { BPServiceItemsService } from './bpservice-items.service';

describe('BPServiceItemsService', () => {
  let service: BPServiceItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPServiceItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
