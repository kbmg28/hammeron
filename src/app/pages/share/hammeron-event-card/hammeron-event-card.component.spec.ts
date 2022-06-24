import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HammeronEventCardComponent } from './hammeron-event-card.component';

describe('HammeronEventCardComponent', () => {
  let component: HammeronEventCardComponent;
  let fixture: ComponentFixture<HammeronEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HammeronEventCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HammeronEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
