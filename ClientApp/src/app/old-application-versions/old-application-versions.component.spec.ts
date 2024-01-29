import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldApplicationVersionsComponent } from './old-application-versions.component';

describe('OldApplicationVersionsComponent', () => {
  let component: OldApplicationVersionsComponent;
  let fixture: ComponentFixture<OldApplicationVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldApplicationVersionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldApplicationVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
