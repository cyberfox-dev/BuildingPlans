import { TestBed } from '@angular/core/testing';

import { FrequentlyAskedQuestionsService } from './frequently-asked-questions.service';

describe('FrequentlyAskedQuestionsService', () => {
  let service: FrequentlyAskedQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrequentlyAskedQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
