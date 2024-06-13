import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPStagesComponent } from './bpstages.component';

describe('BPStagesComponent', () => {
  let component: BPStagesComponent;
  let fixture: ComponentFixture<BPStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPStagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
