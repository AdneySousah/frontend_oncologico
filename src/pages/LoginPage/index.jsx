import React, { useState, useContext, useEffect } from "react";
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
  const [errorMessage, setErrorMessage] = useState("");
  
  // Novos estados
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Carregar credenciais salvas ao abrir a tela
  useEffect(() => {
    const savedEmail = localStorage.getItem("oncologico:savedEmail");
    const savedPassword = localStorage.getItem("oncologico:savedPassword");
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Limpa erros anteriores
    
    try {
      await Login(email, password);
      
      // Se logou com sucesso e "Lembrar" está marcado, salva os dados
      if (rememberMe) {
        localStorage.setItem("oncologico:savedEmail", email);
        localStorage.setItem("oncologico:savedPassword", password);
      } else {
        // Se desmarcou, remove do storage
        localStorage.removeItem("oncologico:savedEmail");
        localStorage.removeItem("oncologico:savedPassword");
      }
      
    } catch (error) {
      // Captura o erro do AuthConfig e exibe na tela
      setErrorMessage("Usuário e/ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <S.Container>
      <S.ThemeToggleButton onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
      </S.ThemeToggleButton>

      <S.LoginCard>
        <S.Logo src={logoImg} alt="Logo CICFarma" />

        <S.HeaderBrand>
          <h1>Seja bem vindo</h1>
          <p>Digite seus dados para acessar o sistema</p>
        </S.HeaderBrand>
        
        {/* Exibe o erro visualmente caso exista */}
        {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
        
        <S.Form onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.InputIcon>
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
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </S.InputIcon>
            <S.Input 
              id="password"
              type={showPassword ? "text" : "password"} 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {/* Botão de Olhinho */}
            <S.PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                // Ícone de Olho Aberto
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                // Ícone de Olho Fechado
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </S.PasswordToggle>
          </S.InputGroup>

          {/* Row contendo Lembrar Senha e Esqueci a Senha */}
          <S.OptionsRow>
            <S.RememberContainer>
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lembrar credenciais</label>
            </S.RememberContainer>

            <S.ForgotPassword>
              <a href="/reset">Esqueci a senha?</a>
            </S.ForgotPassword>
          </S.OptionsRow>

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