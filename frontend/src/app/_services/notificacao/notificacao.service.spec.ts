import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { NotificacaoService } from './notificacao.service';

describe('NotificacaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [NotificacaoService]
    });
  });

  it('should be created', () => {
    const service: NotificacaoService = TestBed.get(NotificacaoService);
    expect(service).toBeTruthy();
  });
});
