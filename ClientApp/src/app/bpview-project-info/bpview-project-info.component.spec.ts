import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPViewProjectInfoComponent } from './bpview-project-info.component';

describe('BPViewProjectInfoComponent', () => {
  let component: BPViewProjectInfoComponent;
  let fixture: ComponentFixture<BPViewProjectInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPViewProjectInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPViewProjectInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
