import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpActionCenterComponent } from './bp-action-center.component';

describe('BpActionCenterComponent', () => {
  let component: BpActionCenterComponent;
  let fixture: ComponentFixture<BpActionCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpActionCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpActionCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
