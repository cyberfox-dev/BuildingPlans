import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAlertsComponent } from './application-alerts.component';

describe('ApplicationAlertsComponent', () => {
  let component: ApplicationAlertsComponent;
  let fixture: ComponentFixture<ApplicationAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationAlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
