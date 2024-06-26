import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BPServiceItemsComponent } from './bpservice-items.component';

describe('BPServiceItemsComponent', () => {
  let component: BPServiceItemsComponent;
  let fixture: ComponentFixture<BPServiceItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BPServiceItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPServiceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
