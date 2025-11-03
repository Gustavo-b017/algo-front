// src/Componentes/StarRating.jsx
import React from 'react';
import '../../public/style/starRating.scss';

/**
 * Renderiza um display de 5 estrelas com base em uma pontuação (de 0 a 12).
 * @param {object} props
 * @param {number} props.score - A pontuação (escala 0-12).
 * @param {number} [props.totalReviews] - (Opcional) Número de avaliações.
 */
function StarRating({ score, totalReviews }) {
    const MAX_STARS = 5;
    const MAX_SCORE = 12; // Define o máximo da sua pontuação

    // 1. Normaliza o score (de 0-12) para a escala de 0-5
    // (Garante que o score não passe de 12)
    const normalizedScore = (Math.min(score, MAX_SCORE) / MAX_SCORE) * MAX_STARS;

    // 2. Calcula a porcentagem de preenchimento (baseado na escala de 5 estrelas)
    const scorePercent = (normalizedScore / MAX_STARS) * 100;

    return (
        <div className="star-rating-container">
            <div 
                className="stars-wrapper" 
                // O title exibe a pontuação convertida (ex: 4.5 de 5)
                title={`Avaliação: ${normalizedScore.toFixed(1)} de 5`}
            >
                {/* Camada de estrelas vazias (fundo) */}
                <div className="stars-empty">
                    {[...Array(MAX_STARS)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="star-icon">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                        </svg>
                    ))}
                </div>
                {/* Camada de estrelas preenchidas (sobreposição) */}
                <div className="stars-filled" style={{ width: `${scorePercent}%` }}>
                    {[...Array(MAX_STARS)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="star-icon">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                        </svg>
                    ))}
                </div>
            </div>
            {/* Exibe a contagem de avaliações, se fornecida */}
            {typeof totalReviews === 'number' && (
                <span className="review-count">({totalReviews})</span>
            )}
        </div>
    );
}

export default StarRating;