import { TestBed } from '@angular/core/testing';

import { ProfessionalsLinksService } from './professionals-links.service';

describe('ProfessionalsLinksService', () => {
  let service: ProfessionalsLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessionalsLinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
