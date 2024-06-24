import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpConfirmModalComponent } from './bp-confirm-modal.component';

describe('BpConfirmModalComponent', () => {
  let component: BpConfirmModalComponent;
  let fixture: ComponentFixture<BpConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpConfirmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
