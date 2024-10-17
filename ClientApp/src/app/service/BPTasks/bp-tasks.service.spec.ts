import { TestBed } from '@angular/core/testing';

import { BpTasksService } from './bp-tasks.service';

describe('BpTasksService', () => {
  let service: BpTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
