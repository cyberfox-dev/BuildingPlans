import { TestBed } from '@angular/core/testing';

import { BPFunctionalAreasService } from './bpfunctional-areas.service';

describe('BPFunctionalAreasService', () => {
  let service: BPFunctionalAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPFunctionalAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
