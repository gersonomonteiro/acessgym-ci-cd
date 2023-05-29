import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MensalidadeService } from './mensalidade.service';

describe('MensalidadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [MensalidadeService]
    });
  });

  it('should be created', () => {
    const service: MensalidadeService = TestBed.get(MensalidadeService);
    expect(service).toBeTruthy();
  });
});
