import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMusicDialogComponent } from './delete-music-dialog.component';

describe('DeleteMusicDialogComponent', () => {
  let component: DeleteMusicDialogComponent;
  let fixture: ComponentFixture<DeleteMusicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMusicDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMusicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
