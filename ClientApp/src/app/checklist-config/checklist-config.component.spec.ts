import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistConfigComponent } from './checklist-config.component';

describe('ChecklistConfigComponent', () => {
  let component: ChecklistConfigComponent;
  let fixture: ComponentFixture<ChecklistConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
