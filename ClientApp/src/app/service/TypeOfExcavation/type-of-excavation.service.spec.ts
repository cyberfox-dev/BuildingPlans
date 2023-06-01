import { TestBed } from '@angular/core/testing';

import { TypeOfExcavationService } from './type-of-excavation.service';

describe('TypeOfExcavationService', () => {
  let service: TypeOfExcavationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeOfExcavationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
