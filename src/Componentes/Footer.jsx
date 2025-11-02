import "/public/style/footer.scss";
import phone from "/public/imagens/icones/phone-call.png";
import email from "/public/imagens/icones/mail.png";
import instagram from "/public/imagens/icones/instagram.png";
import facebook from "/public/imagens/icones/facebook.png"
import linkeding from "/public/imagens/icones/linkeding.png"

function Footer() {
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
                        <li><a href="https://www.redeancora.com.br/industrias/">Lojas parceiras</a></li>
                        <li><a href="https://www.redeancora.com.br/quem_somos/">Quem somos?</a></li>
                        <li><a href="#">Suporte</a></li>
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
                <p>© 2025 pecacerta.com | Design by Gabriel de Mendonça</p>
            </div>

        </footer>
    );
}

export default Footer;