import React, { useState } from 'react';
import '../../public/style/avaliacoes.scss';
import dadosAvaliacoes from '../../public/avaliacoes.json'; // Importa o arquivo JSON

function Avaliacoes() {
    // Acessa os dados importados do JSON
    const avaliacoes = dadosAvaliacoes.avaliacoes;

    // Começa mostrando 4 comentários por padrão
    const [comentariosVisiveis, setComentariosVisiveis] = useState(4);
    const comentariosIniciais = 4;

    const mostrarMaisComentarios = () => {
        // Aumenta o número de comentários visíveis em 3
        setComentariosVisiveis(prev => prev + 3);
    };

    const encolherComentarios = () => {
        // Retorna ao número inicial de comentários
        setComentariosVisiveis(comentariosIniciais);
    };

    const temMaisComentarios = comentariosVisiveis < avaliacoes.comentarios.length;
    const podeEncolher = comentariosVisiveis > comentariosIniciais;

    return (
        <section className="avaliacoes-secao">
            <h2>Avaliações</h2>
            <div className="avaliacoes-conteudo">
                {/* Coluna da Esquerda: Resumo das Estrelas */}
                <div className="avaliacoes-resumo">
                    {avaliacoes.resumo.map((item) => (
                        <div className="resumo-linha" key={item.estrelas}>
                            <div className="estrelas-numero">{item.estrelas}</div>
                            <div className="barra-progresso-fundo">
                                <div
                                    className="barra-progresso-preenchimento"
                                    style={{ width: `${item.porcentagem}%` }}
                                ></div>
                            </div>
                            <div className="porcentagem">{item.porcentagem}%</div>
                        </div>
                    ))}
                </div>

                {/* Coluna da Direita: Cards de Comentários */}
                <div className="avaliacoes-comentarios">
                    {avaliacoes.comentarios.slice(0, comentariosVisiveis).map((comentario, index) => (
                        <div className="comentario-card" key={index}>

                            <div className="comentario-estrelas">
                                {'⭐'.repeat(comentario.estrelas)}
                            </div>

                            <p className="comentario-texto">{comentario.texto}</p>

                            <div className="info-usuario">
                                <div className="avatar-placeholder"><img src={comentario.perfil} alt="perfil user" /></div>
                                <div className="info-texto">
                                    <p className="nome-usuario">{comentario.nome}</p>
                                    <p className="tempo-atras">{comentario.tempo}</p>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>

            {/* Renderiza os botões de forma condicional */}
            <div className="botoes-avaliacoes">
                {temMaisComentarios && (
                    <button className="ver-mais-btn" onClick={mostrarMaisComentarios}>
                        Veja mais avaliações &gt;
                    </button>
                )}
                {podeEncolher && (
                    <button className="encolher-btn" onClick={encolherComentarios}>
                        Encolher &lt;
                    </button>
                )}
            </div>
        </section>
    );
}

export default Avaliacoes;