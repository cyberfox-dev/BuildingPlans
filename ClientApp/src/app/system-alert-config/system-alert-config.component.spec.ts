import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAlertConfigComponent } from './system-alert-config.component';

describe('SystemAlertConfigComponent', () => {
  let component: SystemAlertConfigComponent;
  let fixture: ComponentFixture<SystemAlertConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAlertConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemAlertConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
