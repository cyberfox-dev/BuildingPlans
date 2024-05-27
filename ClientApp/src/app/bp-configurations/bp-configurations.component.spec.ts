import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpConfigurationsComponent } from './bp-configurations.component';

describe('BpConfigurationsComponent', () => {
  let component: BpConfigurationsComponent;
  let fixture: ComponentFixture<BpConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpConfigurationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
