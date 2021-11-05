import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSpaceComponent } from './change-space.component';

describe('ChangeSpaceComponent', () => {
  let component: ChangeSpaceComponent;
  let fixture: ComponentFixture<ChangeSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
