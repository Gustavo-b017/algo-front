// src/Paginas/Suporte.jsx
// -----------------------------------------------------------------------------
// Página: Central de Suporte / Ajuda
//
// Objetivos:
// - Disponibilizar um ponto de contato para o usuário (formulário de “Fale Conosco”).
// - Exibir uma lista de dúvidas frequentes (FAQ) em formato de acordeão.
//
// Funcionamento (estado e UI):
// - O FAQ utiliza um estado simples (openFAQ) para controlar qual item está aberto.
// - O formulário é apenas demonstrativo: onSubmit faz um alert simulando envio.
//
// Integração (pronta para evoluir):
// - Atualmente não há chamada ao backend. Para integrar, substitua a função
//   handleSubmit por uma requisição (fetch/axios) ao endpoint de suporte.
// - Recomenda-se adicionar validação simples (HTML5 + checagens JS) e um
//   feedback visual (toast/snackbar) em caso de sucesso/erro.
//
// Acessibilidade e UX:
// - Botões do acordeão usam aria-expanded para leitores de tela.
// - Labels estão associados por htmlFor/id nos campos do formulário.
// - Layout semântico com header/main/footer e classes utilitárias do projeto.
//
// Manutenção e extensões:
// - Para adicionar mais itens ao FAQ, inclua objetos no array faqData.
// - Para evitar spam, considere incluir reCAPTCHA e limites de taxa no backend.
// - Se necessário, desmembrar FaqItem em um arquivo próprio e documentá-lo.
//
// Estilos:
// - A folha ../../public/style/suporte.scss controla o layout (grid, tipografia,
//   transições do acordeão e responsividade).
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';

// Estilos específicos da página de suporte
import '../../public/style/suporte.scss';

// Base de dados (mock) do FAQ.
// Para internacionalização ou CMS, troque por busca remota ou arquivo JSON.
const faqData = [
    {
        id: 1,
        question: "Como rastrear meu pedido?",
        answer: "Assim que seu pedido for despachado, você receberá um e-mail com o código de rastreio e o link da transportadora. Você também pode acessar a seção 'Meus Pedidos' em seu perfil."
    },
    {
        id: 2,
        question: "Qual a política de devolução?",
        answer: "Você pode solicitar a devolução de um produto em até 7 dias corridos após o recebimento, desde que o produto esteja em sua embalagem original e sem sinais de uso."
    },
    {
        id: 3,
        question: "Como sei se a peça é compatível?",
        answer: "Recomendamos que você utilize a busca por placa ou chassi em nosso site. Se ainda tiver dúvidas, entre em contato com nossa equipe de especialistas através deste formulário."
    }
];

// Item de FAQ isolado para clareza e reuso.
// Mantém semântica de botão (acessível) e aplica aria-expanded.
function FaqItem({ item, isOpen, onToggle }) {
    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
                className="faq-question"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                {item.question}
            </button>

            {/* Wrapper com altura animável via CSS; conteúdo real fica dentro */}
            <div className="faq-answer-wrapper">
                <div className="faq-answer">
                    {item.answer}
                </div>
            </div>
        </div>
    );
}

export default function Suporte() {
    // Controla qual item do FAQ está aberto (armazenamos apenas o id ou null)
    const [openFAQ, setOpenFAQ] = useState(null);

    // Alterna o acordeão: se o mesmo item for clicado, fecha; caso contrário, abre.
    const toggleFAQ = (id) => {
        if (openFAQ === id) {
            setOpenFAQ(null);
        } else {
            setOpenFAQ(id);
        }
    };

    // Formulário demonstrativo sem envio real.
    // Para integrar: validar, bloquear múltiplos envios e enviar via fetch/axios.
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Mensagem enviada (simulação)!");
    };

    return (
        <div className="container">
            <Header />

            {/* Conteúdo principal da página de suporte */}
            <div className="suporte-page-container">
                <div className="suporte-content-wrapper">
                    <h2>Central de Ajuda</h2>

                    <div className="suporte-main-content">
                        {/* Bloco 1 — Formulário de contato (demo) */}
                        <div className="suporte-form-block">
                            <h4>Fale Conosco</h4>
                            <p>Tem alguma dúvida ou sugestão? Envie uma mensagem.</p>

                            <form onSubmit={handleSubmit} className='form-suporte'>
                                <div className="form-group-suporte">
                                    <label htmlFor="suporte-nome">Nome Completo</label>
                                    <input id="suporte-nome" type="text" placeholder="Seu nome" />
                                </div>

                                <div className="form-group-suporte">
                                    <label htmlFor="suporte-email">E-mail</label>
                                    <input id="suporte-email" type="email" placeholder="voce@exemplo.com" />
                                </div>

                                <div className="form-group-suporte">
                                    <label htmlFor="suporte-mensagem">Mensagem</label>
                                    <textarea id="suporte-mensagem" rows="5" placeholder="Digite sua mensagem aqui..."></textarea>
                                </div>

                                <button type="submit" className="create-account-btn">
                                    Enviar Mensagem
                                </button>
                            </form>
                        </div>

                        {/* Bloco 2 — FAQ (acordeão) */}
                        <div className="suporte-faq-block">
                            <h4>Dúvidas Frequentes</h4>

                            <div className="faq-list">
                                {faqData.map(item => (
                                    <FaqItem
                                        key={item.id}
                                        item={item}
                                        isOpen={openFAQ === item.id}
                                        onToggle={() => toggleFAQ(item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
