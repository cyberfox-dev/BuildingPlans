import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPDemolitionApplicationComponent } from './bpdemolition-application.component';

describe('DemolitionApplicationComponent', () => {
  let component: BPDemolitionApplicationComponent;
  let fixture: ComponentFixture<BPDemolitionApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPDemolitionApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPDemolitionApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
