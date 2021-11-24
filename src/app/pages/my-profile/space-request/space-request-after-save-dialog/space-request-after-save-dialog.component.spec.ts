import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceRequestAfterSaveDialogComponent } from './space-request-after-save-dialog.component';

describe('SpaceRequestAfterSaveDialogComponent', () => {
  let component: SpaceRequestAfterSaveDialogComponent;
  let fixture: ComponentFixture<SpaceRequestAfterSaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceRequestAfterSaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceRequestAfterSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
