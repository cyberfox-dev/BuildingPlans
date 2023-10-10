import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRepositoryConfigComponent } from './document-repository-config.component';

describe('DocumentRepositoryConfigComponent', () => {
  let component: DocumentRepositoryConfigComponent;
  let fixture: ComponentFixture<DocumentRepositoryConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentRepositoryConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRepositoryConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
