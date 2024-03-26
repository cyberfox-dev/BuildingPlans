import { TestBed } from '@angular/core/testing';

import { BPDocumentsUploadsService } from './bpdocuments-uploads.service';

describe('BPDocumentsUploadsService', () => {
  let service: BPDocumentsUploadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPDocumentsUploadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
