import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPDepartmentDocRequiredUploadsComponent } from './bpdepartment-doc-required-uploads.component';

describe('BPDepartmentDocRequiredUploadsComponent', () => {
  let component: BPDepartmentDocRequiredUploadsComponent;
  let fixture: ComponentFixture<BPDepartmentDocRequiredUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPDepartmentDocRequiredUploadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPDepartmentDocRequiredUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
