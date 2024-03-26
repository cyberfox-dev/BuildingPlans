import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArchitectsComponent } from './edit-architects.component';

describe('EditArchitectsComponent', () => {
  let component: EditArchitectsComponent;
  let fixture: ComponentFixture<EditArchitectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditArchitectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditArchitectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
