// src/Componentes/Categorias.jsx
// ============================================================================
// Componente: Categorias
// ----------------------------------------------------------------------------
// Propósito
// - Exibir um grid/carrossel simples de categorias clicáveis para acelerar a
//   navegação do usuário pela busca (ex.: “Cambio”, “Filtro”, “Óleo”).
//
// Diretrizes (alinhadas ao back-end e às práticas do projeto)
// - Responsabilidade única: UI + emissão de evento de clique. Este componente
//   não realiza chamadas de API nem manipula URL; apenas chama `onCategoryClick`,
//   permitindo que a página hospedeira decida o que fazer (navegar, setar query,
//   atualizar parâmetros etc.).
// - Previsibilidade: recebe via props a função `onCategoryClick(name)` e a
//   aciona com o nome da categoria selecionada.
// - Acessibilidade/UX: usa <button> para interação de teclado; cada ícone tem
//   `alt` descritivo; texto visível acompanha o ícone.
// - Extensibilidade: a lista `category_list` é estática neste arquivo por
//   simplicidade. Pode ser carregada dinamicamente no futuro sem alterar a
//   assinatura do componente.
// - Performance: lista pequena e estática; `useRef` reservado para evoluções
//   (ex.: navegação por rolagem, scroll snap, botões “próximo/anterior”).
// ============================================================================

import React, { useRef } from "react";
import "/public/style/categorias.scss";

// Ícones (assets locais). Mantidos como import estático para evitar latência.
import dif_icon from "/public/imagens/icones/categorias/differential.png";
import eng_icon from "/public/imagens/icones/categorias/settings.png";
import gear_icon from "/public/imagens/icones/categorias/gearshift.png";
import filt_icon from "/public/imagens/icones/categorias/oil-filter.png";
import oil_icon from "/public/imagens/icones/categorias/oil.png";
import shock_icon from "/public/imagens/icones/categorias/shock-absorber.png";

// Lista estática de categorias exibidas.
// Observação: IDs garantem keys estáveis no .map; `name` é o rótulo mostrado.
const category_list = [
    { name: "Cambio", id: 1, src: gear_icon },
    { name: "Engrenagem", id: 2, src: eng_icon },
    // { name: "Disco", id: 3, src:  },
    // { name: "Pastilha", id: 4, src: },
    { name: "Amortecedor", id: 5, src: shock_icon },
    // { name: "Vela", id: 6, src:  },
    { name: "Diferencial", id: 7, src: dif_icon },
    { name: "Filtro", id: 8, src: filt_icon },
    { name: "Oleo", id: 9, src: oil_icon },
    // { name: "Combustível", id: 10, src: }
];

// Props esperadas:
// - onCategoryClick: (name: string) => void
//   (A página hospedeira decide a ação: ex. navegar para `/resultados?termo=${name}`.)
function Categorias({ onCategoryClick }) {
    // `carouselRef` pronto para futuras melhorias (scroll horizontal programático).
    const carouselRef = useRef(null);

    return (
        <div className="categorias_container">
            {/* Wrapper para aplicar estilos de carrossel/responsividade via CSS */}
            <div className="carousel-wrapper">
                {/* Grid/linha rolável de categorias. O `ref` permite scrollTo/scrollBy se necessário. */}
                <div className="categorias_grid" ref={carouselRef}>
                    {category_list.map((category) => (
                        // Cada categoria é um botão para permitir foco/teclado/ARIA adequados.
                        <button
                            key={category.id}
                            onClick={() => onCategoryClick(category.name)} // Emite o nome da categoria
                        >
                            <div className="categoria_img">
                                {/* Ícone da categoria. `alt` descreve a imagem para leitores de tela. */}
                                <img src={category.src} alt={category.name} />
                            </div>
                            {/* Rótulo textual (auxilia acessibilidade e SEO em SSR). */}
                            <p>{category.name}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Categorias;
