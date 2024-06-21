import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPFinancialsComponent } from './bpfinancials.component';

describe('BPFinancialsComponent', () => {
  let component: BPFinancialsComponent;
  let fixture: ComponentFixture<BPFinancialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPFinancialsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
