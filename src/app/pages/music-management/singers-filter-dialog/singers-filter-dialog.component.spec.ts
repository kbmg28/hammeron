import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingersFilterDialogComponent } from './singers-filter-dialog.component';

describe('SingersFilterDialogComponent', () => {
  let component: SingersFilterDialogComponent;
  let fixture: ComponentFixture<SingersFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingersFilterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingersFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
