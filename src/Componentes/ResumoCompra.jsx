// src/Componentes/ResumoCompra.jsx
import React from 'react';
import '/public/style/resumoCompra.scss';

// Função utilitária para formatar valores em BRL
const formatBRL = (v) =>
    typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

// O componente recebe os dados do carrinho como props
function ResumoCompra({ subtotal, totalItens }) {
    // Valores de frete e total simulados para demonstração
    const valorFrete = 0; // Exemplo de frete grátis
    const valorTotalComFrete = subtotal + valorFrete;
    const valorTotalPix = valorTotalComFrete * 0.9; // Exemplo de 10% de desconto no Pix

    return (
        <div className="resumo-compra-container">
            <div className="titulo-resumo-compra">
                <h1>Resumo da Compra</h1>
                <hr/>
            </div>
            {/* Seção de Frete */}
            <div className="resumo-frete-carrinho">
                <h4>Frete para o CEP</h4>
                <div className="frete-input-group">
                    <input type="text" placeholder="00000-000" className="cep-input" />
                    <button className="frete-ok-btn">OK</button>
                </div>
                <a href="#" className="cep-link">Não sei o CEP</a>
            </div>

            {/* Seção de Valores */}
            <div className="resumo-valores">
                <div className="resumo-linha">
                    <p>Frete total:</p>
                    <p>Frete Grátis</p>
                </div>
                <div className="resumo-linha">
                    <p>Produtos ({totalItens} itens):</p>
                    <p>{formatBRL(subtotal)}</p>
                </div>
                <div className="resumo-total">
                    <p>Total:</p>
                    <div className="valores-total-group">
                        <p className="valor-pix">
                            {formatBRL(valorTotalPix)} no PIX
                        </p>
                        <p className="valor-cartao">
                            ou {formatBRL(valorTotalComFrete)} no cartão
                        </p>
                    </div>
                </div>
            </div>

            {/* Seção de Ações */}
            <div className="resumo-botoes-acoes">
                <button className="finalizar-compra-btn">Finalizar Compra</button>
                <button className="escolher-mais-btn">Escolher mais produtos</button>
            </div>
        </div>
    );
}

export default ResumoCompra;