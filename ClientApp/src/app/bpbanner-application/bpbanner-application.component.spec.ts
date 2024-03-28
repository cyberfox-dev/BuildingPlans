import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPBannerApplicationComponent } from './bpbanner-application.component';

describe('BPBannerApplicationComponent', () => {
  let component: BPBannerApplicationComponent;
  let fixture: ComponentFixture<BPBannerApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPBannerApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPBannerApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
