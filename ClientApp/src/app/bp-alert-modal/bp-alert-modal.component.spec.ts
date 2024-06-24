import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpAlertModalComponent } from './bp-alert-modal.component';

describe('BpAlertModalComponent', () => {
  let component: BpAlertModalComponent;
  let fixture: ComponentFixture<BpAlertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpAlertModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpAlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
