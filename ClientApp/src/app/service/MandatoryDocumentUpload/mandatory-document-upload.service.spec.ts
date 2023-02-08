import { TestBed } from '@angular/core/testing';

import { MandatoryDocumentUploadService } from './mandatory-document-upload.service';

describe('MandatoryDocumentUploadService', () => {
  let service: MandatoryDocumentUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandatoryDocumentUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
