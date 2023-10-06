import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRepositoryComponent } from './document-repository.component';

describe('DocumentRepositoryComponent', () => {
  let component: DocumentRepositoryComponent;
  let fixture: ComponentFixture<DocumentRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
