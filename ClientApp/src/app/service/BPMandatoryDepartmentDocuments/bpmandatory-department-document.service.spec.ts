import { TestBed } from '@angular/core/testing';

import { BPMandatoryDepartmentDocumentService } from './bpmandatory-department-document.service';

describe('BPMandatoryDepartmentDocumentService', () => {
  let service: BPMandatoryDepartmentDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPMandatoryDepartmentDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
