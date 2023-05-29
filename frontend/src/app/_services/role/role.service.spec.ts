import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { RoleService } from '../role/role.service';

describe('RoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [RoleService]
    });
  });

  it('should be created', () => {
    const service: RoleService = TestBed.get(RoleService);
    expect(service).toBeTruthy();
  });
});
