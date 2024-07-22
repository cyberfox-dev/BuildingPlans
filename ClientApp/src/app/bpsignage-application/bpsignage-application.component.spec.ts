import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('SignageApplicationComponent', () => {
  let component: SignageApplicationComponent;
  let fixture: ComponentFixture<SignageApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignageApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignageApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
