import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemolitionApplicationComponent } from './demolition-application.component';

describe('DemolitionApplicationComponent', () => {
  let component: DemolitionApplicationComponent;
  let fixture: ComponentFixture<DemolitionApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemolitionApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemolitionApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
