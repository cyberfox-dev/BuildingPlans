import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationClassificationConfigComponent } from './occupation-classification-config.component';

describe('OccupationClassificationConfigComponent', () => {
  let component: OccupationClassificationConfigComponent;
  let fixture: ComponentFixture<OccupationClassificationConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccupationClassificationConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OccupationClassificationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
