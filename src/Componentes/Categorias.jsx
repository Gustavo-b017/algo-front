import React, { useRef } from "react";
import "/public/style/categorias.scss";
import dif_icon from "/public/imagens/icones/categorias/differential.png";
import eng_icon from "/public/imagens/icones/categorias/settings.png";
import gear_icon from "/public/imagens/icones/categorias/gearshift.png";
import filt_icon from "/public/imagens/icones/categorias/oil-filter.png";
import oil_icon from "/public/imagens/icones/categorias/oil.png";
import shock_icon from "/public/imagens/icones/categorias/shock-absorber.png";

const category_list = [
    { name: "Cambio", id: 1, src: gear_icon },
    { name: "Engrenagem", id: 2, src: eng_icon },
    //{ name: "Disco", id: 3, src:  },
    //{ name: "Pastilha", id: 4, src: },
    { name: "Amortecedor", id: 5, src: shock_icon },
    //{ name: "Vela", id: 6, src:  },
    { name: "Diferencial", id: 7, src: dif_icon },
    { name: "Filtro", id: 8, src: filt_icon },
    { name: "Oleo", id: 9, src: oil_icon },
    //{ name: "Combustível", id: 10, src: }
]

function Categorias({ onCategoryClick }) {
    const carouselRef = useRef(null);

    return (
        <div className="categorias_container">
            <div className="carousel-wrapper">
                <div className="categorias_grid" ref={carouselRef}>
                    {category_list.map((category) => (
                        <button 
                            key={category.id}
                            onClick={() => onCategoryClick(category.name)}
                        >
                            <div className="categoria_img">
                                <img src={category.src} alt={category.name} />
                            </div>
                            <p>{category.name}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Categorias;