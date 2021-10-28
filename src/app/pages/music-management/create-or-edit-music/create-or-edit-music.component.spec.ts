import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditMusicComponent } from './create-or-edit-music.component';

describe('CreateMusicComponent', () => {
  let component: CreateOrEditMusicComponent;
  let fixture: ComponentFixture<CreateOrEditMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditMusicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
