import { TestBed } from '@angular/core/testing';

import { SpaceStorageService } from './space-storage.service';

describe('SpaceStorageService', () => {
  let service: SpaceStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
