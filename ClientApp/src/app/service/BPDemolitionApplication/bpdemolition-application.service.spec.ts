import { TestBed } from '@angular/core/testing';

import { BPDemolitionApplicationService } from './bpdemolition-application.service';

describe('BPDemolitionApplicationService', () => {
  let service: BPDemolitionApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPDemolitionApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
