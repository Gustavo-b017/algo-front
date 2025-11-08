// src/Componentes/Avaliacoes.jsx
// ============================================================================
// Componente: Avaliacoes
// ----------------------------------------------------------------------------
// Propósito
// - Exibir um bloco de avaliações composto por um resumo de distribuição de
//   estrelas (lado esquerdo) e uma lista de comentários (lado direito), com
//   paginação incremental simples ("ver mais" / "encolher").
//
// Diretrizes (alinhadas às adotadas no back-end)
// - Responsabilidade única: este componente é exclusivamente de apresentação
//   (UI). Não realiza chamadas remotas nem altera dados de domínio.
// - Previsibilidade: o estado local controla apenas a quantidade de comentários
//   visíveis, evitando efeitos colaterais.
// - Acessibilidade: mantém a estrutura semântica básica (título <h2>). Caso
//   necessário, atributos ARIA podem ser adicionados futuramente sem alterar a
//   lógica (ver TODOs).
// - Performance: o uso de `slice` limita o número de cards renderizados; não há
//   reprocessamentos pesados.
// - Extensibilidade: os rótulos e a mecânica de "ver mais" podem ser parametrizados
//   futuramente via props (ver TODOs).
//
// Observações
// - Os dados vêm de um JSON estático público (`/public/avaliacoes.json`). O
//   componente assume que a estrutura desse arquivo segue o padrão utilizado
//   aqui (chaves `resumo` e `comentarios`).
//
// TODOs (sem alterar a implementação atual):
// - Tornar `comentariosIniciais` e o incremento configuráveis por props.
// - Adicionar `aria-label`/`role` para barras de progresso e nota em estrelas,
//   melhorando leitura por leitores de tela.
// - Suportar carregamento preguiçoso de avatares com `loading="lazy"`.
// ============================================================================

import React, { useState } from 'react';
import '../../public/style/avaliacoes.scss';
import dadosAvaliacoes from '../../public/avaliacoes.json'; // Importa o arquivo JSON

function Avaliacoes() {
    // Extrai a raiz de avaliações do JSON importado.
    // Estrutura esperada:
    // {
    //   "avaliacoes": {
    //     "resumo": [{ "estrelas": number, "porcentagem": number }, ...],
    //     "comentarios": [{ "estrelas": number, "texto": string, "perfil": url, "nome": string, "tempo": string }, ...]
    //   }
    // }
    const avaliacoes = dadosAvaliacoes.avaliacoes;

    // Controle de paginação simples no cliente:
    // - Começa exibindo 4 comentários.
    // - O botão "Veja mais avaliações" adiciona +3 por clique.
    // - O botão "Encolher" retorna ao valor inicial.
    const [comentariosVisiveis, setComentariosVisiveis] = useState(4);
    const comentariosIniciais = 4;

    // Incrementa a janela de comentários visíveis em blocos de 3.
    const mostrarMaisComentarios = () => {
        setComentariosVisiveis(prev => prev + 3);
    };

    // Retorna para a janela inicial de comentários.
    const encolherComentarios = () => {
        setComentariosVisiveis(comentariosIniciais);
    };

    // Deriva flags de UI para exibição condicional dos botões de ação.
    const temMaisComentarios = comentariosVisiveis < avaliacoes.comentarios.length;
    const podeEncolher = comentariosVisiveis > comentariosIniciais;

    return (
        <section className="avaliacoes-secao">
            {/* Título semântico do bloco de avaliações. */}
            <h2>Avaliações</h2>

            <div className="avaliacoes-conteudo">
                {/* Coluna Esquerda: Resumo das Estrelas
                   - Lista a distribuição percentual por faixa de estrelas.
                   - Cada linha apresenta: número de estrelas, barra de progresso e porcentagem. */}
                <div className="avaliacoes-resumo">
                    {avaliacoes.resumo.map((item) => (
                        <div className="resumo-linha" key={item.estrelas}>
                            <div className="estrelas-numero">{item.estrelas}</div>
                            <div className="barra-progresso-fundo">
                                <div
                                    className="barra-progresso-preenchimento"
                                    // Largura proporcional à porcentagem reportada.
                                    style={{ width: `${item.porcentagem}%` }}
                                ></div>
                            </div>
                            <div className="porcentagem">{item.porcentagem}%</div>
                        </div>
                    ))}
                </div>

                {/* Coluna Direita: Lista de Comentários
                   - Exibe somente o recorte atual (`slice(0, comentariosVisiveis)`).
                   - Cada card traz nota em estrelas, texto e informações do usuário. */}
                <div className="avaliacoes-comentarios">
                    {avaliacoes.comentarios.slice(0, comentariosVisiveis).map((comentario, index) => (
                        <div className="comentario-card" key={index}>
                            {/* Nota em estrelas (representação visual simples). */}
                            <div className="comentario-estrelas">
                                {'⭐'.repeat(comentario.estrelas)}
                            </div>

                            {/* Texto livre do comentário. */}
                            <p className="comentario-texto">{comentario.texto}</p>

                            {/* Identificação do usuário: avatar + metadados (nome/tempo). */}
                            <div className="info-usuario">
                                <div className="avatar-placeholder">
                                    <img src={comentario.perfil} alt="perfil user" />
                                </div>
                                <div className="info-texto">
                                    <p className="nome-usuario">{comentario.nome}</p>
                                    <p className="tempo-atras">{comentario.tempo}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ações de paginação local: exibidas conforme as flags derivadas. */}
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
