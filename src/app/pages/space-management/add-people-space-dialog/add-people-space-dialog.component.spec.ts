import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeopleSpaceDialogComponent } from './add-people-space-dialog.component';

describe('AddPeopleSpaceDialogComponent', () => {
  let component: AddPeopleSpaceDialogComponent;
  let fixture: ComponentFixture<AddPeopleSpaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPeopleSpaceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPeopleSpaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
