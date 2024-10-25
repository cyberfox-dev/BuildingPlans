import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPTasksComponent } from './bptasks.component';

describe('BPTasksComponent', () => {
  let component: BPTasksComponent;
  let fixture: ComponentFixture<BPTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
