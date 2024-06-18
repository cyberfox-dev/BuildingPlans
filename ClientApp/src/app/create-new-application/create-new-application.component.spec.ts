import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewApplicationComponent } from './create-new-application.component';

describe('CreateNewApplicationComponent', () => {
  let component: CreateNewApplicationComponent;
  let fixture: ComponentFixture<CreateNewApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
