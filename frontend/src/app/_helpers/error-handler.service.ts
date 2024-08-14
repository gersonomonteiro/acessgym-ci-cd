import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private errorMessages: { [key: string]: string } = {
    '404': 'Recurso não encontrado.',
    '500': 'Erro interno do servidor.',
    '400': 'Solicitação inválida.',
    '401': 'Não autorizado. Verifique suas credenciais.',
    '403': 'Acesso negado.',
    // Adicione mais códigos de erro e mensagens conforme necessário
  };

  constructor() { }

  getErrorMessage(errorCode: string): string {
    return this.errorMessages[errorCode] || 'Ocorreu um erro inesperado.';
  }
}
