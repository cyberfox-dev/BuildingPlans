import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSizeConfigComponent } from './project-size-config.component';

describe('ProjectSizeConfigComponent', () => {
  let component: ProjectSizeConfigComponent;
  let fixture: ComponentFixture<ProjectSizeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSizeConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSizeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
