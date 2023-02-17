import { TestBed } from '@angular/core/testing';

import { MandatoryDocumentStageLinkService } from './mandatory-document-stage-link.service';

describe('MandatoryDocumentStageLinkService', () => {
  let service: MandatoryDocumentStageLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandatoryDocumentStageLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
