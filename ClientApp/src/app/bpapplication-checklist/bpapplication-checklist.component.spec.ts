import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPApplicationChecklistComponent } from './bpapplication-checklist.component';

describe('BPApplicationChecklistComponent', () => {
  let component: BPApplicationChecklistComponent;
  let fixture: ComponentFixture<BPApplicationChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPApplicationChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPApplicationChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
