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
            <div className="brands_container">
                {brand_list.map(brand => (
                    <button key={brand.id}>
                        <div className="brand_img">
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