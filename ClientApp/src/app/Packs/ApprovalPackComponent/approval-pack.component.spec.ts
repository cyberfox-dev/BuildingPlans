import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPackComponent } from './approval-pack.component';

describe('ApprovalPackComponent', () => {
  let component: ApprovalPackComponent;
  let fixture: ComponentFixture<ApprovalPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalPackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
