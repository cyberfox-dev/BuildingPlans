import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsConfigComponent } from './bugs-config.component';

describe('BugsConfigComponent', () => {
  let component: BugsConfigComponent;
  let fixture: ComponentFixture<BugsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugsConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
