import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HammeronLoadingComponent } from './hammeron-loading.component';

describe('HammeronLoadingComponent', () => {
  let component: HammeronLoadingComponent;
  let fixture: ComponentFixture<HammeronLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HammeronLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HammeronLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
