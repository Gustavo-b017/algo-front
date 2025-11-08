// src/Componentes/Footer.jsx
// ============================================================================
// Componente: Footer
// ----------------------------------------------------------------------------
// Objetivo
// - Fornece o rodapé institucional do site, com:
///   • link de retorno ao topo da página,
///   • bloco “Sobre” com texto institucional e contatos,
///   • lista de links úteis (navegação secundária),
///   • formulário estático de contato com ícones de redes sociais,
///   • aviso de direitos autorais.
//
// Diretrizes e alinhamento arquitetural (consistentes com o back):
// - Responsabilidade única: componente puramente de apresentação (stateless).
//   Não mantém estado, não faz chamadas à API e não acopla regras de negócio.
// - Acessibilidade: imagens possuem atributo `alt`; rótulos e hierarquia semântica
//   (headings, parágrafos, listas) auxiliam tecnologias assistivas.
// - Estilização: todo o layout é controlado por classes em `/public/style/footer.scss`.
//   Alterações visuais devem ser feitas exclusivamente nessas folhas de estilo.
// - Navegação:
//   • Links internos usam `<a href="...">`. Em aplicações SPA, normalmente
//     utilizar-se-ia `<Link>` do `react-router-dom` para evitar recarregamentos,
//     mas mantém-se `<a>` para compatibilidade com o projeto atual.
//   • Links externos abrem normalmente na mesma aba; caso deseje comportamento
//     diferente (ex.: nova aba), ajuste via atributos `target`/`rel` na folha de
//     estilo ou evolua o markup, sem alterar este componente.
// - Conteúdo: textos institucionais e contatos são estáticos. Caso seja necessário
//   torná-los dinâmicos, recomenda-se receber tais dados por props ou via contexto,
//   preservando a separação de responsabilidades.
// - Manutenibilidade: ícones e imagens são importados de `/public/imagens/icones`.
//   Para atualizar marcas/ícones, substitua os arquivos mantendo os mesmos nomes
//   ou ajuste os imports aqui.
//
// Observações de interoperabilidade:
// - Este componente não depende de nenhum dado do back-end. Pode ser reutilizado
//   em qualquer rota/página sem impacto em integrações.
// ============================================================================

import "/public/style/footer.scss";
import phone from "/public/imagens/icones/phone-call.png";
import email from "/public/imagens/icones/mail.png";
import instagram from "/public/imagens/icones/instagram.png";
import facebook from "/public/imagens/icones/facebook.png"
import linkeding from "/public/imagens/icones/linkeding.png"

function Footer() {
    // Componente funcional e estático: a renderização é sempre a mesma,
    // garantindo previsibilidade e performance (sem efeitos colaterais).
    return (
        <footer className="footer-container">
            <div className="footer-top">
                <a href="#" className="back-to-top">Voltar ao inicío</a>
            </div>
            <div className="footer-main">
                <div className="footer-section about-us">
                    <h4>Peça Certa</h4>
                    <p>
                        O PeçaCerta é um aplicativo desenvolvido para facilitar a busca e compra
                        de autopeças com segurança, rapidez e o melhor preço. Conectamos você às
                        melhores lojas e oficinas, garantindo praticidade e confiança na hora de
                        cuidar do seu veículo.
                    </p>
                    <div className="contact-info">
                        <p><span><img src={phone} alt="Telefone" /></span> (11) 98765-4321</p>
                        <p><span><img src={email} alt="Email" /></span> contato@pecacerta.com</p>
                    </div>
                </div>

                <div className="footer-section links">
                    <h4>Seções de Links</h4>
                    <ul>
                        <li><a href="/resultados">Início Catálogo de peças</a></li>
                        <li><a href="https://www.redeancora.com.br">Empresa parceira</a></li>
                        <li><a href="Projeto by G³">Quem somos?</a></li>
                        <li><a href="/suporte">Suporte</a></li>
                    </ul>
                </div>

                <div className="footer-section contact-form">
                    <h4>Entre em contato</h4>
                    <form>
                        <input type="email" placeholder="Digite o seu e-mail" />
                        <textarea placeholder="Escreva a sua mensagem..."></textarea>
                        <div className="social-links">
                            <a href="https://www.linkedin.com/company/redeancorabr/" aria-label="LinkedIn"><img src={linkeding} alt="Linkeding" /></a>
                            <a href="https://www.facebook.com/RedeAncora/" aria-label="Facebook"><img src={facebook} alt="Facebook" /></a>
                            <a href="https://www.instagram.com/redeancorabr" aria-label="Instagram"><img src={instagram} alt="Instagram" /></a>
                        </div>
                    </form>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2025 pecacerta.com | Projeto by G³ </p>
            </div>

        </footer>
    );
}

export default Footer;
