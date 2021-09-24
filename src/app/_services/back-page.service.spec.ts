import { TestBed } from '@angular/core/testing';

import { BackPageService } from './back-page.service';

describe('BackPageService', () => {
  let service: BackPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
