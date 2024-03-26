import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPViewStageChecklistComponent } from './bpview-stage-checklist.component';

describe('BPViewStageChecklistComponent', () => {
  let component: BPViewStageChecklistComponent;
  let fixture: ComponentFixture<BPViewStageChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPViewStageChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPViewStageChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
