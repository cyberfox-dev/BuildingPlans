import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPFileUploadComponent } from './bpfile-upload.component';

describe('BPFileUploadComponent', () => {
  let component: BPFileUploadComponent;
  let fixture: ComponentFixture<BPFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPFileUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
