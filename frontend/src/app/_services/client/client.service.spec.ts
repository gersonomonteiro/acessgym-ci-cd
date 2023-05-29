import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ClientService } from './client.service';

describe('ClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ClientService]
    });
  });

  it('should be created', () => {
    const service: ClientService = TestBed.get(ClientService);
    expect(service).toBeTruthy();
  });
});
