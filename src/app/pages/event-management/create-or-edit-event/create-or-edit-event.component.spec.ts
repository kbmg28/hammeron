import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditEventComponent } from './create-or-edit-event.component';

describe('CreateOrEditEventComponent', () => {
  let component: CreateOrEditEventComponent;
  let fixture: ComponentFixture<CreateOrEditEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
