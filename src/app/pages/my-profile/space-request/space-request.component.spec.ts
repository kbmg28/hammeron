import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceRequestComponent } from './space-request.component';

describe('SpaceRequestComponent', () => {
  let component: SpaceRequestComponent;
  let fixture: ComponentFixture<SpaceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
