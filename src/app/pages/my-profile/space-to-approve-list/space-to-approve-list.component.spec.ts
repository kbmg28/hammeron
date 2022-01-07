import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceToApproveListComponent } from './space-to-approve-list.component';

describe('SpaceToApproveListComponent', () => {
  let component: SpaceToApproveListComponent;
  let fixture: ComponentFixture<SpaceToApproveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceToApproveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceToApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
