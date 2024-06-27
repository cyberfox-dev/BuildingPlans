import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpMandoryDocumentsComponent } from './bp-mandory-documents.component';

describe('BpMandoryDocumentsComponent', () => {
  let component: BpMandoryDocumentsComponent;
  let fixture: ComponentFixture<BpMandoryDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpMandoryDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpMandoryDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
