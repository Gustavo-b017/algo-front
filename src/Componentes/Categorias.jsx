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
    { name: "DIREÇÃO E SUSPENSÃO", id: 1, src: wheel_icon },
    { name: "MOTOR E TRANSMISSÃO", id: 2, src: motor_icon },
    { name: "FREIOS E PASTILHAS", id: 3, src: disc_icon },
    { name: "ELÉTRICO E IGNIÇÃO", id: 4, src: ignicao_icon },
    { name: "ESCAPE E RADIADOR", id: 5, src: escape_icon },
    { name: "FIXAÇÃO E FERRAGENS", id: 6, src: support_icon },
    { name: "ADITIVOS E LUBRIFICANTES ", id: 7, src: oil_icon },
    { name: "ESTRUTURA E CARROCERIA", id: 8, src: estrutura_icon },
    { name: "SEGMENTOS ESPECIAIS", id: 9, src: car_icon }
]

function Categorias() {
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 200; // Ajuste a quantidade de rolagem
            if (direction === "left") {
                carouselRef.current.scrollLeft -= scrollAmount;
            } else {
                carouselRef.current.scrollLeft += scrollAmount;
            }
        }
    };
    return (
        <div className="categorias_container">
            <div className="carousel-wrapper">
                <div className="categorias_grid" ref={carouselRef}>
                    {category_list.map((category) => (
                        <button key={category.id}>
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