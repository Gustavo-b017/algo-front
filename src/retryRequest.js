// utils/retryRequest.js
// ============================================================================
// Utilitário: retryRequest
// ----------------------------------------------------------------------------
// Objetivo
// - Realizar uma chamada HTTP GET com tentativas automáticas de repetição (retry)
//   em caso de falha, respeitando um número máximo de tentativas.
//
// Diretrizes alinhadas ao back
// - Função pequena, coesa e previsível (Single Responsibility).
// - Não altera nem transforma a resposta do backend: retorna o **AxiosResponse**,
//   mantendo a superfície compatível com outras chamadas já existentes.
// - Não encapsula regras de negócio: apenas lida com transporte/requisição.
// - Erros são propagados ao chamador após esgotar as tentativas.
//
// Contrato (assinatura estável)
// - retryRequest(url: string, attempts?: number) => Promise<AxiosResponse>
//   • url: endpoint absoluto ou relativo (respeitar base do axios do projeto, se houver).
//   • attempts: número total de tentativas (padrão = 2). Ex.: attempts=2 → 1ª + 1 retry.
//
// Comportamento de erro
// - Em caso de erro, a função tenta novamente até esgotar `attempts`.
// - Se todas falharem, relança o último erro do Axios sem mascarar a causa,
//   permitindo tratamento no nível superior (toast, fallback, logs).
//
// Limitações/Observações
// - Método fixo em GET (intencionalmente simples). Para generalizar, considerar
//   aceitar `config` do Axios ou injetar método/headers em uma versão futura.
// - Sem política de backoff (linear/exponencial). Se necessário, implementar
//   `await new Promise(r => setTimeout(r, X))` entre tentativas.
//
// Testes sugeridos
// - Deve retornar na 1ª tentativa quando sucesso.
// - Deve tentar N vezes e falhar no final relançando o erro.
// - Deve interromper imediatamente ao primeiro sucesso.
// ============================================================================

import axios from 'axios';

/**
 * Executa uma requisição GET com tentativas de repetição (retry).
 *
 * @param {string} url - URL do recurso (absoluta ou relativa).
 * @param {number} [attempts=2] - Número total de tentativas (inclui a primeira).
 * @returns {Promise<import('axios').AxiosResponse>} - Resposta completa do Axios.
 * @throws {any} - Relança o erro da última tentativa se todas falharem.
 */
export async function retryRequest(url, attempts = 2) {
  // Loop controlado pelo número total de tentativas:
  // i=0 → tentativa inicial; i=1.. → retries.
  for (let i = 0; i < attempts; i++) {
    try {
      // Mantém o método GET explícito e sem side-effects adicionais.
      const response = await axios.get(url);
      // Sucesso: retorna imediatamente, não tenta novamente.
      return response;
    } catch (error) {
      // Se ainda há tentativas disponíveis, segue o loop silenciosamente.
      // Caso contrário (última iteração), propaga o erro ao chamador.
      if (i === attempts - 1) {
        throw error;
      }
      // Opcional (não implementado por diretriz de não alterar lógica):
      // inserir backoff aqui, se necessário, antes de continuar o loop.
    }
  }
}
