// src/Componentes/ResumoCompra.jsx
// ============================================================================
// Componente: ResumoCompra
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir um quadro sintético dos valores do carrinho (frete, subtotal e total).
//
// Diretrizes arquiteturais (alinhadas ao back):
// - Responsabilidade única: renderização/UX do resumo. Não calcula regras de
//   negócio complexas nem consulta a API diretamente (SRP).
// - Contrato de dados: recebe `subtotal` (Number) e `totalItens` (Number) por
//   props, calculados pela página de Carrinho com base nos itens vindos do
//   endpoint do back (/carrinho). Mantém o componente “burro” (sem acoplamento).
// - Interoperabilidade: formatação monetária local (pt-BR) é feita apenas na
//   camada de apresentação (evita divergências de locale no servidor).
// - Evolução/Integração: o cálculo de frete está “mockado” (frete grátis). Quando
//   houver endpoint específico de frete (ex.: /frete/cotacao), a página de
//   Carrinho deve obtê-lo e injetar aqui (mantendo este componente stateless).
//
// Observações de UX/Acessibilidade:
// - Botões e links possuem rótulos claros; campos têm placeholders objetivos.
// - Navegação: “Escolher mais produtos” usa roteamento para retornar à Home.
// ============================================================================

import React from 'react';
import '/public/style/resumoCompra.scss';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Utilitário de apresentação
// - Converte Number em moeda BRL conforme locale pt-BR.
// - Mantido mínimo e coeso, sem efeitos colaterais.
// ---------------------------------------------------------------------------
const formatBRL = (v) =>
    typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

// ----------------------------------------------------------------------------
// Componente funcional “apenas UI”
// Props esperadas (contrato):
//   - subtotal: soma dos itens (Number) calculada no Carrinho
//   - totalItens: quantidade total de unidades (Number)
// Regras de negócio (frete/cupom) devem ser resolvidas fora e injetadas aqui.
// ----------------------------------------------------------------------------
function ResumoCompra({ subtotal, totalItens }) {
    const navigate = useNavigate();

    // Placeholder de frete:
    // - Mantido como 0 para “Frete Grátis” neste estágio.
    //   - Futuro: receber `valorFrete` por props (ou contexto) calculado via API.
    const valorFrete = 0;

    // Total “apresentacional”: soma do subtotal com o frete já resolvido fora
    const valorTotalComFrete = subtotal + valorFrete;

    return (
        <div className="resumo-compra-container">
            <div className="titulo-resumo-compra">
                <h1>Resumo da Compra</h1>
                <hr />
            </div>

            {/* ----------------------------------------------------------------
                Bloco de “Frete”
                - Apenas UI/inputs. A ação do botão “OK” não dispara requisição
                  aqui (por diretriz). Quando houver serviço, a página pai deve
                  ouvir o CEP e atualizar frete/total por props.
               ---------------------------------------------------------------- */}
            <div className="resumo-frete-carrinho">
                <h4>Frete para o CEP</h4>
                <div className="frete-input-group">
                    <input type="text" placeholder="00000-000" className="cep-input" />
                    <button className="frete-ok-btn">OK</button>
                </div>
                <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" className="cep-link">Não sei o CEP</a>
            </div>

            {/* ----------------------------------------------------------------
                Valores (apenas apresentação)
                - “Frete Grátis” enquanto `valorFrete` for 0.
                - Subtotal/Total formatados no padrão BRL para consistência visual.
               ---------------------------------------------------------------- */}
            <div className="resumo-valores">
                <div className="resumo-linha">
                    <p>Frete total:</p>
                    <p>Frete Grátis</p>
                </div>
                <div className="resumo-linha">
                    <p>Produtos ({totalItens} itens):</p>
                    <p>{formatBRL(subtotal)}</p>
                </div>

                <hr className="resumo-compra-linha" />

                <div className="resumo-total">
                    <h4>Total:</h4>
                    <div className="valores-total-group">
                        <p className="valor-pix">
                            {formatBRL(valorTotalComFrete)} no PIX
                        </p>
                        <p className="valor-cartao">
                            ou {formatBRL(valorTotalComFrete)} no cartão
                        </p>
                    </div>
                </div>
            </div>

            {/* ----------------------------------------------------------------
                Ações
                - “Finalizar Compra”: mantém apenas o CTA visual (fluxo de
                  checkout deve ser controlado pela página/container).
                - “Escolher mais produtos”: navega para a Home.
               ---------------------------------------------------------------- */}
            <div className="resumo-botoes-acoes">
                <button className="finalizar-compra-btn">Finalizar Compra</button>
                <button className="escolher-mais-btn" onClick={() => navigate("/")}>Escolher mais produtos</button>
            </div>
        </div>
    );
}

export default ResumoCompra;
