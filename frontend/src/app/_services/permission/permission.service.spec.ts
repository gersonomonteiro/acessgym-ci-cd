import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PermissionService]
    });
  });

  it('should be created', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    expect(service).toBeTruthy();
  });
});
