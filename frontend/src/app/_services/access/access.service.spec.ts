import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AccessService } from './access.service';

describe('AccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AccessService]
    });
  });

  it('should be created', () => {
    const service: AccessService = TestBed.get(AccessService);
    expect(service).toBeTruthy();
  });
});
