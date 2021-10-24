import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMusicDialogComponent } from './view-music-dialog.component';

describe('ViewMusicDialogComponent', () => {
  let component: ViewMusicDialogComponent;
  let fixture: ComponentFixture<ViewMusicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMusicDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMusicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
