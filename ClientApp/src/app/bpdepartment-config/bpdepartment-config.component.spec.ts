import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPDepartmentConfigComponent } from './bpdepartment-config.component';

describe('BPDepartmentConfigComponent', () => {
  let component: BPDepartmentConfigComponent;
  let fixture: ComponentFixture<BPDepartmentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPDepartmentConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPDepartmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
