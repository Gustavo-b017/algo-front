import React, { useRef } from "react";
import "/public/style/categorias.scss";
import motor_icon from "/public/imagens/icones/motor.png";
import wheel_icon from "/public/imagens/icones/wheel.png";
import disc_icon from "/public/imagens/icones/disc.png";
import ignicao_icon from "/public/imagens/icones/ignicao.png";
import car_icon from "/public/imagens/icones/car-2.png";
import escape_icon from "/public/imagens/icones/escape.png";
import support_icon from "/public/imagens/icones/support.png";
import oil_icon from "/public/imagens/icones/engine-oil.png"
import estrutura_icon from "/public/imagens/icones/carroceria.png"

const category_list = [
    { name: "Cambio", id: 1, src: wheel_icon },
    { name: "Engrenagem", id: 2, src: motor_icon },
    { name: "Disco", id: 3, src: disc_icon },
    { name: "Pastilha", id: 4, src: ignicao_icon },
    { name: "Amortecedor", id: 5, src: escape_icon },
    { name: "Vela", id: 6, src: support_icon },
    { name: "Diferencial", id: 7, src: oil_icon },
    { name: "Filtro", id: 8, src: estrutura_icon },
    { name: "Oleo", id: 9, src: car_icon },
    { name: "Combustível", id: 10, src: car_icon }
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