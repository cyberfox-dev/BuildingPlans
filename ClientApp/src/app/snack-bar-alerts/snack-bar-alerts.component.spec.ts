import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarAlertsComponent } from './snack-bar-alerts.component';

describe('SnackBarAlertsComponent', () => {
  let component: SnackBarAlertsComponent;
  let fixture: ComponentFixture<SnackBarAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackBarAlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackBarAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
