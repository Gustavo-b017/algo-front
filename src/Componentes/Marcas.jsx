import "../Estilosao/marcas.scss";
import bmw from "../imagens/marcas_logo/bmw.png";
import ford from "../imagens/marcas_logo/ford.png";
import honda from "../imagens/marcas_logo/honda.png";
import hyundai from "../imagens/marcas_logo/hyundai.png";
import infiniti from "../imagens/marcas_logo/infiniti.png";
import kia from "../imagens/marcas_logo/kia.png";
import lexus from "../imagens/marcas_logo/lexus.png";
import mazda from "../imagens/marcas_logo/mazda.png";
import mercedez from "../imagens/marcas_logo/mercedes-benz.png";
import mitsubishi from "../imagens/marcas_logo/mitsubishi.png";
import toyota from "../imagens/marcas_logo/toyota.png";
import volkswagen from "../imagens/marcas_logo/volkswagen.png"

const brand_list = [
    { name: "Honda", id: 1, src: honda },
    { name: "KIA", id: 2, src: kia },
    { name: "Hyundai", id: 3, src: hyundai },
    { name: "Volkswagen", id: 4, src: volkswagen },
    { name: "Ford", id: 5, src: ford },
    { name: "Mitsubihi", id: 6, src: mitsubishi },
    { name: "Mercedez Benz", id: 7, src: mercedez },
    { name: "Bmw", id: 8, src: bmw },
    { name: "Toyota", id: 9, src: toyota },
    { name: "Lexus", id: 10, src: lexus },
    { name: "Infiniti", id: 10, src: infiniti },
    { name: "Mazda", id: 10, src: mazda }
]

function Marcas() {
    return (
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
    );
}

export default Marcas;