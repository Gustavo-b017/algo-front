// src/Componentes/Banner.jsx
// ============================================================================
// Componente: Banner (Carrossel Bootstrap)
// ----------------------------------------------------------------------------
// Propósito
// - Exibir um carrossel de banners na página inicial utilizando o Carousel do
//   Bootstrap (CSS + JS).
//
// Diretrizes (alinhadas às adotadas no back-end)
// - Responsabilidade única: componente estritamente de apresentação.
// - Previsibilidade: não há estado/local effects; o comportamento é controlado
//   por atributos `data-bs-*` do Bootstrap.
// - Acessibilidade: utiliza `aria-label`, `aria-current` e rótulos visuais
//   ocultos (classe `visually-hidden`) nos controles de navegação.
// - Performance: imagens otimizáveis via pipeline do bundler; sem lógica
//   adicional de renderização.
// - Extensibilidade: personalizações (intervalo, pausa no hover, wrap, teclado)
//   podem ser adicionadas por `data-bs-interval`, `data-bs-pause`, etc., sem
//   alterar a estrutura.
//
// Observações
// - O `bootstrap.bundle.min.js` já inclui o Popper necessário ao Carousel.
// - Se houver mais de um carousel na página, cada instância deve ter um `id`
//   exclusivo (aqui: `#carouselExampleIndicators`).
// - Mantenha as imagens com dimensões consistentes para evitar layout shift.
//
// TODOs (sem alterar a implementação atual)
// - Adicionar `loading="lazy"` nas imagens se o contexto permitir (avaliar
//   impacto no LCP).
// - Tornar a lista de banners dinâmica (via props ou CMS).
// - Expor propriedades para `interval`, `ride`, `touch` e `keyboard`.
// ============================================================================

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../public/style/banner.scss';

// Import de ativos estáticos (resolvidos pelo bundler/Vite)
import banner1 from "../../public/imagens/banners/banner1.png";
import banner2 from "../../public/imagens/banners/banner2.png";
import banner3 from "../../public/imagens/banners/banner3.png";

function Banner() {
    return (
        <div className="banner">
            {/* Container do Carousel Bootstrap */}
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                {/* Indicadores (pontos de navegação) */}
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>

                {/* Faixas do carousel (cada .carousel-item é um slide) */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src={banner1} alt="Primeiro Slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src={banner2} alt="Segundo Slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src={banner3} alt="Terceiro Slide" />
                    </div>
                </div>

                {/* Controles anterior/próximo (navegação por setas) */}
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                </button>

                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Próximo</span>
                </button>
            </div>
        </div >
    );
}

export default Banner;
