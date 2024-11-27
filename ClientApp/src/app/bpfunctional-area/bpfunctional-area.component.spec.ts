import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPFunctionalAreaComponent } from './bpfunctional-area.component';

describe('BPFunctionalAreaComponent', () => {
  let component: BPFunctionalAreaComponent;
  let fixture: ComponentFixture<BPFunctionalAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPFunctionalAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPFunctionalAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
