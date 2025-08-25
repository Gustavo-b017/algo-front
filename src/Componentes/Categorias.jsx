import "/public/style/categorias.scss";
import battery_icon from "/public/imagens/icones/battery.png";
import wheel_icon from "/public/imagens/icones/wheel.png";
import headlight_icon from "/public/imagens/icones/headlight.png";
import padlock_icon from "/public/imagens/icones/padlock.png"
import car_icon from "/public/imagens/icones/car-2.png"
import support_icon from "/public/imagens/icones/support.png"
import oil_icon from "/public/imagens/icones/engine-oil.png"
import steering_icon from "/public/imagens/icones/steering_wheel.png"
import motocycle_icon from "/public/imagens/icones/motocycle.png"

const category_list = [
    { name: "Baterias e Acessórios", id: 1, src: battery_icon },
    { name: "Pneus e Calotas", id: 2, src: wheel_icon },
    { name: "Farol e Iluminação", id: 3, src: headlight_icon },
    { name: "Alarme e Segurança", id: 4, src: padlock_icon },
    { name: "Acessórios Externos", id: 5, src: car_icon },
    { name: "Ferramentas e Equipamentos", id: 6, src: support_icon },
    { name: "Óleo e Aditivos", id: 7, src: oil_icon },
    { name: "Acessórios Internos", id: 8, src: steering_icon },
    { name: "Acessórios Externos", id: 9, src: car_icon },
    { name: "Motocicletas", id: 10, src: motocycle_icon }
]

function Categorias() {
    return (
        <div className="categorias_container">
            {category_list.map(category => (
                <button key={category.id}>
                    <div className="categoria_img">
                        <img src={category.src} alt={category.name} />
                    </div>
                    <p>{category.name}</p>
                </button>
            ))}
        </div>
    );
}

export default Categorias;