import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceRequestDetailsDialogComponent } from './space-request-details-dialog.component';

describe('SpaceRequestDetailsDialogComponent', () => {
  let component: SpaceRequestDetailsDialogComponent;
  let fixture: ComponentFixture<SpaceRequestDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceRequestDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceRequestDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
