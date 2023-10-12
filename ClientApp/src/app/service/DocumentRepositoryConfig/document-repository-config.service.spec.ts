import { TestBed } from '@angular/core/testing';

import { DocumentRepositoryConfigService } from './document-repository-config.service';

describe('DocumentRepositoryConfigService', () => {
  let service: DocumentRepositoryConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentRepositoryConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
