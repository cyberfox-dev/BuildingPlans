import { TestBed } from '@angular/core/testing';

import { BPManDocService } from './bpman-doc.service';

describe('BPManDocService', () => {
  let service: BPManDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPManDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
