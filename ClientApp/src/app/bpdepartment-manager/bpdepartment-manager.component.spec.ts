import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPDepartmentManagerComponent } from './bpdepartment-manager.component';

describe('BPDepartmentManagerComponent', () => {
  let component: BPDepartmentManagerComponent;
  let fixture: ComponentFixture<BPDepartmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPDepartmentManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPDepartmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
