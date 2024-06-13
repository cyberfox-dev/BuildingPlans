import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPRolesConfigComponent } from './bproles-config.component';

describe('BPRolesConfigComponent', () => {
  let component: BPRolesConfigComponent;
  let fixture: ComponentFixture<BPRolesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPRolesConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPRolesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
