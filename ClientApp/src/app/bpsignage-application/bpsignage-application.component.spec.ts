import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BPSignageApplicationComponent } from './bpsignage-application.component';


describe('SignageApplicationComponent', () => {
  let component: BPSignageApplicationComponent;
  let fixture: ComponentFixture<BPSignageApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BPSignageApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BPSignageApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
