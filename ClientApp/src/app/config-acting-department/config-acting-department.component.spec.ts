import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigActingDepartmentComponent } from './config-acting-department.component';

describe('ConfigActingDepartmentComponent', () => {
  let component: ConfigActingDepartmentComponent;
  let fixture: ComponentFixture<ConfigActingDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigActingDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigActingDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
