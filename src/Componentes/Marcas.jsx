// src/Componentes/Marcas.jsx
// ============================================================================
// Componente: Marcas
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir uma grade de “marcas de carros” com logo e nome, em layout responsivo.
// - Este componente é **puramente de apresentação**: não chama API e não
//   possui estado. O comportamento (clique, navegação, etc.) pode ser delegado
//   ao pai no futuro, mantendo a separação de responsabilidades.
//
// Diretrizes alinhadas ao back
// - Mantém contrato estável e previsível: aqui a lista é **estática** (mock).
//   Caso o backend passe a fornecer as marcas, recomenda-se transformar a
//   fonte de dados em `props` (ex.: `marcas`) sem alterar a estrutura visual.
// - Nenhuma regra de negócio é aplicada neste componente.
//
// Contrato (props)
// - (nenhum). A lista é interna. Em evoluções futuras, poderíamos receber:
//   • `marcas: Array<{ id:number|string, name:string, src:string }>`
//   • `onBrandClick?: (brand) => void` para o pai decidir a ação do clique.
//
// Acessibilidade
// - `alt={brand.name}` nas imagens descreve o logotipo.
// - Os logos estão dentro de `<button>` para indicar affordance de ação
//   (mesmo que hoje não exista handler), facilitando a evolução sem mudar a UI.
//
// Performance
// - Lista pequena e estática → renderização direta com `map` e `key` estável.
// - Sem re-renderizações desnecessárias por ausência de estado local.
//
// Testes sugeridos
// - Renderização padrão: exibe 12 marcas com logo e nome.
// - Acessibilidade: imagens têm `alt` coerente.
// - Regressão visual: verificar classes CSS (layout/responsividade).
// ============================================================================

import "/public/style/marcas.scss";
import bmw from "/public/imagens/marcas_logo/bmw.png";
import ford from "/public/imagens/marcas_logo/ford.png";
import honda from "/public/imagens/marcas_logo/honda.png";
import hyundai from "/public/imagens/marcas_logo/hyundai.png";
import infiniti from "/public/imagens/marcas_logo/infiniti.png";
import kia from "/public/imagens/marcas_logo/kia.png";
import lexus from "/public/imagens/marcas_logo/lexus.png";
import mazda from "/public/imagens/marcas_logo/mazda.png";
import mercedez from "/public/imagens/marcas_logo/mercedes-benz.png";
import mitsubishi from "/public/imagens/marcas_logo/mitsubishi.png";
import toyota from "/public/imagens/marcas_logo/toyota.png";
import volkswagen from "/public/imagens/marcas_logo/volkswagen.png"

// Fonte de dados **estática** (mock). Mantida aqui por simplicidade.
// Em futura integração com o backend, esta lista pode ser injetada via props.
const brand_list = [
    { name: "Honda", id: 1, src: honda },
    { name: "KIA", id: 2, src: kia },
    { name: "Hyundai", id: 3, src: hyundai },
    { name: "Volkswagen", id: 4, src: volkswagen },
    { name: "Ford", id: 5, src: ford },
    { name: "Mitsubishi", id: 6, src: mitsubishi },
    { name: "Mercedez-Benz", id: 7, src: mercedez },
    { name: "BMW", id: 8, src: bmw },
    { name: "Toyota", id: 9, src: toyota },
    { name: "Lexus", id: 10, src: lexus },
    { name: "Infiniti", id: 11, src: infiniti },
    { name: "Mazda", id: 12, src: mazda }
];

function Marcas() {
    return (
        <div className="brands">
            <h2>COMPRE POR MARCAS DE CARROS</h2>

            {/* Container responsivo com grid/scroll controlado via SCSS */}
            <div className="brands_container">
                {brand_list.map(brand => (
                    // `key` estável (id da marca). Mantém reconciliação eficiente do React.
                    <button className="brand_btn" key={brand.id}>
                        <div className="brand_img">
                            {/* `alt` descritivo para acessibilidade */}
                            <img src={brand.src} alt={brand.name} />
                            <p>{brand.name}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>

    );
}

export default Marcas;
