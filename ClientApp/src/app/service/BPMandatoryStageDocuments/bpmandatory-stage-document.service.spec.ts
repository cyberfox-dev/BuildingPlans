import { TestBed } from '@angular/core/testing';

import { BPMandatoryStageDocumentService } from './bpmandatory-stage-document.service';

describe('BPMandatoryStageDocumentService', () => {
  let service: BPMandatoryStageDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPMandatoryStageDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
