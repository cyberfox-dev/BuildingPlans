import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPAccessGroupsConfigComponent } from './bpaccess-groups-config.component';

describe('BPAccessGroupsConfigComponent', () => {
  let component: BPAccessGroupsConfigComponent;
  let fixture: ComponentFixture<BPAccessGroupsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPAccessGroupsConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPAccessGroupsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
