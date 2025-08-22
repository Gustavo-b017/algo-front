import "../Estilosao/categorias.css";
import battery_icon from "../imagens/icones/battery.png";
import wheel_icon from "../imagens/icones/wheel.png";
import headlight_icon from "../imagens/icones/headlight.png";

const category_list = [
    { name: "Baterias e Acessórios", id: 1, src: battery_icon },
    { name: "Pneus e Calotas", id: 2, src: wheel_icon },
    { name: "Farol e Iluminação", id: 3, src: headlight_icon },
    { name: "Alarme e Segurança", id: 4, src: wheel_icon },
    { name: "Acessórios Externos", id: 5, src: wheel_icon },
    { name: "Ferramentas e Equipamentos", id: 6, src: wheel_icon },
    { name: "Óleo e Aditivos", id: 7, src: wheel_icon },
    { name: "Acessórios Internos", id: 8, src: wheel_icon },
    { name: "Acessórios Externos", id: 9, src: wheel_icon },
    { name: "Motocicletas", id: 10, src: wheel_icon }
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