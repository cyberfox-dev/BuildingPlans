import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOfWorksComponent } from './status-of-works.component';

describe('StatusOfWorksComponent', () => {
  let component: StatusOfWorksComponent;
  let fixture: ComponentFixture<StatusOfWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusOfWorksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusOfWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
