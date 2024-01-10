import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionPackComponent } from './rejection-pack.component';

describe('RejectionPackComponent', () => {
  let component: RejectionPackComponent;
  let fixture: ComponentFixture<RejectionPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectionPackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
