import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdeptWayleaveExpirationComponent } from './subdept-wayleave-expiration.component';

describe('SubdeptWayleaveExpirationComponent', () => {
  let component: SubdeptWayleaveExpirationComponent;
  let fixture: ComponentFixture<SubdeptWayleaveExpirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubdeptWayleaveExpirationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubdeptWayleaveExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
