// src/Paginas/Suporte.jsx
import React, { useState } from 'react';
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';

// NOVO: Importa o estilo da página de suporte
import '../../public/style/suporte.scss';

// Dados de exemplo para o FAQ
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

// Componente do item do FAQ (para o accordion)
function FaqItem({ item, isOpen, onToggle }) {
    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
                {item.question}
            </button>
            <div className="faq-answer-wrapper">
                <div className="faq-answer">
                    {item.answer}
                </div>
            </div>
        </div>
    );
}

export default function Suporte() {
    // Estado para controlar qual item do accordion está aberto
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (id) => {
        if (openFAQ === id) {
            setOpenFAQ(null); // Fecha se já estiver aberto
        } else {
            setOpenFAQ(id); // Abre o novo
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ação de envio desabilitada (apenas design)
        alert("Mensagem enviada (simulação)!");
    };

    return (
        <div className="container">
            <Header />
            
            <div className="suporte-page-container">
                <div className="suporte-content-wrapper">
                    <h2>Central de Ajuda</h2>

                    <div className="suporte-main-content">
                        
                        {/* Bloco 1: Formulário de Contato */}
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
                        
                        {/* Bloco 2: Dúvidas Frequentes (FAQ) */}
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