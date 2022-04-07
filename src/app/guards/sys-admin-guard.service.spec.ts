import { TestBed } from '@angular/core/testing';

import { SysAdminGuardService } from './sys-admin-guard.service';

describe('SysAdminGuardService', () => {
  let service: SysAdminGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysAdminGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
