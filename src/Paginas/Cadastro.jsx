import React from 'react';
import '/public/style/cadastro.scss'; 
import logo from '/public/imagens/logo_ancora.svg'; 

function Cadastro() {
  return (
    <div className="cadastro-page-container">
        
      <div className="background-azul"></div>

      <header className="cadastro-header">
        <img src={logo} alt="Logo Âncora" className="cadastro-logo" />
      </header>
      
      <div className="cadastro-form-card">
        <div className="card-header">
          <h2>Crie uma conta</h2>
          <p>Maneira simples e rápida de continuar suas compras</p>
        </div>
        
        <form className="cadastro-form">
          <div className="form-group">
            <label htmlFor="primeiroNome">Primeiro Nome</label>
            <input 
              type="text" 
              id="primeiroNome" 
              placeholder="Marcos" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Endereço de email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="marcos@exemplo.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-input-wrapper">
              <input 
                type="password" 
                id="senha" 
                placeholder="************" 
              />
              <span className="eye-icon">
                {/* Ícone de olho (substitua por um SVG ou ícone real se tiver) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.183z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </div>
          </div>
          
          <div className="checkbox-group">
            <input type="checkbox" id="termos" />
            <label htmlFor="termos">Eu li e concordo com os termos de uso</label>
          </div>
          
          <button type="submit" className="create-account-btn">
            CRIAR CONTA
          </button>
        </form>
        
        <div className="separator">ou se inscreva com</div>
        
        <div className="social-login">
          <button className="social-btn google-btn">
            {/* Ícone do Google */}
            <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
          </button>
          <button className="social-btn apple-btn">
            {/* Ícone da Apple */}
            <img src="https://img.icons8.com/sf-regular-filled/48/000000/apple.png" alt="Apple" />
          </button>
          <button className="social-btn facebook-btn">
            {/* Ícone do Facebook */}
            <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" />
          </button>
        </div>
        
        <p className="login-link">
          Já possui uma conta? <a href="#">Faça o LOGIN</a>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;