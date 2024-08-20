import { TestBed } from '@angular/core/testing';

import { DrawingCoOrdinatesService } from './drawing-co-ordinates.service';

describe('DrawingCoOrdinatesService', () => {
  let service: DrawingCoOrdinatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingCoOrdinatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
