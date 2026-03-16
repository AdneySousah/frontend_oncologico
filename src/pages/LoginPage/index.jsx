import React, { useState, useContext } from "react";
import * as S from "./styles";
import { AuthContext } from "../../hooks/AuthConfig";
import { ThemeContext } from "../../hooks/ThemeConfig";

// Importação da Logo
import logoImg from "../../assets/logo_branca.png";

export default function LoginPage() {
  const { Login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await Login(email, password);
    } catch (error) {
      console.error("Erro ao logar", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <S.Container>
      {/* Botão para trocar o tema claro/escuro */}
      <S.ThemeToggleButton onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
      </S.ThemeToggleButton>

      <S.LoginCard>
        
        {/* Logo inserida aqui no lugar do ícone SVG */}
        <S.Logo src={logoImg} alt="Logo CICFarma" />

        {/* Títulos internos para seguir o estilo moderno */}
        <S.HeaderBrand>
          <h1>Seja bem vindo </h1>
          <p>Digite seus dados para acessar o sistema</p>
        </S.HeaderBrand>
        
        <S.Form onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.InputIcon>
              {/* Ícone de Email/Usuário */}
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </S.InputIcon>
            <S.Input 
              id="email"
              type="email" 
              placeholder="Email Corporativo ou CPF" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.InputIcon>
              {/* Ícone de Cadeado */}
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </S.InputIcon>
            <S.Input 
              id="password"
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </S.InputGroup>

          {/* Esqueci minha senha posicionado à direita */}
          <S.ForgotPassword>
            <a href="/reset">Esqueci a senha?</a>
          </S.ForgotPassword>

          <S.ButtonContainer>
            <S.Button type="submit" disabled={loading}>
              {loading ? "Acessando..." : "Entrar"}
            </S.Button>
          </S.ButtonContainer>
        </S.Form>
      </S.LoginCard>
    </S.Container>
  );
}