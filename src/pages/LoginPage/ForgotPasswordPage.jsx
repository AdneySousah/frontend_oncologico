import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles"; // Reutilizando os mesmos estilos do login
import { ThemeContext } from "../../hooks/ThemeConfig";
import api from "../../services/api"; // Substitua pelo caminho do seu axios

// Importação da Logo
import logoImg from "../../assets/logo_branca.png";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nova Senha
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Envia email com o código
  async function handleRequestCode(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/forgot-password", { email });
      setStep(2);
      alert("Código enviado para o seu e-mail!");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao solicitar código.");
    } finally {
      setLoading(false);
    }
  }

  // Verifica se o código é válido
  async function handleVerifyCode(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/verify-code", { email, code });
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.error || "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  }

  // Salva a nova senha
  async function handleResetPassword(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("As senhas não coincidem.");
    }
    
    setLoading(true);
    try {
      await api.post("/reset-password", { email, code, newPassword: password });
      alert("Senha alterada com sucesso!");
      navigate("/"); // Volta para o login
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao resetar senha.");
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

        {/* Logo inserida aqui no lugar do ícone SVG de Cadeado */}
        <S.Logo src={logoImg} alt="Logo CICFarma" />

        <S.HeaderBrand>
          <h1>Recuperar Senha</h1>
          <p>
            {step === 1 && "Informe seu e-mail para receber o código."}
            {step === 2 && "Digite o código de 6 dígitos que enviamos para você."}
            {step === 3 && "Crie uma nova senha para o seu acesso."}
          </p>
        </S.HeaderBrand>
        
        {/* PASSO 1: INFORMAR E-MAIL */}
        {step === 1 && (
          <S.Form onSubmit={handleRequestCode}>
            <S.InputGroup>
              <S.InputIcon>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </S.InputIcon>
              <S.Input 
                type="email" 
                placeholder="Seu E-mail Corporativo" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </S.InputGroup>

            <S.ButtonContainer>
              <S.Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Código"}
              </S.Button>
            </S.ButtonContainer>
          </S.Form>
        )}

        {/* PASSO 2: INFORMAR CÓDIGO */}
        {step === 2 && (
          <S.Form onSubmit={handleVerifyCode}>
            <S.InputGroup>
              <S.InputIcon>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </S.InputIcon>
              <S.Input 
                type="text" 
                placeholder="Código de 6 dígitos" 
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </S.InputGroup>

            <S.ButtonContainer>
              <S.Button type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Validar Código"}
              </S.Button>
            </S.ButtonContainer>
          </S.Form>
        )}

        {/* PASSO 3: NOVA SENHA */}
        {step === 3 && (
          <S.Form onSubmit={handleResetPassword}>
            <S.InputGroup>
              <S.InputIcon>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </S.InputIcon>
              <S.Input 
                type="password" 
                placeholder="Nova Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.InputIcon>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </S.InputIcon>
              <S.Input 
                type="password" 
                placeholder="Repita a Nova Senha" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </S.InputGroup>

            <S.ButtonContainer>
              <S.Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Redefinir Senha"}
              </S.Button>
            </S.ButtonContainer>
          </S.Form>
        )}

        <S.Divider />

        <S.FooterLinks>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
            Voltar para o Login
          </a>
        </S.FooterLinks>
      </S.LoginCard>
    </S.Container>
  );
}