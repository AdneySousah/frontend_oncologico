import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles"; 
import { ThemeContext } from "../../hooks/ThemeConfig";
import api from "../../services/api"; 
import { toast } from "react-toastify";

// Importação da Logo
import logoImg from "../../assets/logo_branca.png";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // === NOVA FUNÇÃO DE FORÇA DE SENHA ===
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 6) score += 1; // Pelo menos 6 caracteres
    if (pass.length >= 8) score += 1; // Bônus para 8+ caracteres
    if (/[A-Z]/.test(pass)) score += 1; // Letra maiúscula
    if (/[0-9]/.test(pass)) score += 1; // Número
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; // Caractere especial
    return score; // Retorna de 0 a 5
  };

  const passwordStrength = calculateStrength(password);

  const getStrengthLabel = (score) => {
    if (score === 0) return "";
    if (score <= 2) return "Fraca";
    if (score === 3) return "Razoável";
    if (score === 4) return "Boa";
    return "Forte";
  };

  async function handleRequestCode(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/forgot-password", { email });
      setStep(2);
      toast.success("Código enviado para o seu e-mail!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao solicitar código.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/verify-code", { email, code });
      setStep(3);
      toast.success("Código validado com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.warning("As senhas não coincidem.");
    }
    // Opcional: Impedir que o usuário salve se a senha for muito fraca
    if (passwordStrength < 3) {
      return toast.warning("Sua senha é muito fraca. Tente misturar letras, números e símbolos.");
    }
    
    setLoading(true);
    try {
      await api.post("/reset-password", { email, code, newPassword: password });
      toast.success("Senha alterada com sucesso!");
      navigate("/"); 
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao resetar senha.");
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
          <h1>Recuperar Senha</h1>
          <p>
            {step === 1 && "Informe seu e-mail para receber o código."}
            {step === 2 && "Digite o código de 6 dígitos que enviamos para você."}
            {step === 3 && "Crie uma nova senha para o seu acesso."}
          </p>
        </S.HeaderBrand>
        
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

        {step === 3 && (
          <S.Form onSubmit={handleResetPassword}>
            <S.InputGroup>
              <S.InputIcon>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </S.InputIcon>
              <S.Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Nova Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <S.PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </S.PasswordToggle>
            </S.InputGroup>

            {/* === BARRA DE FORÇA DA SENHA === */}
            {password.length > 0 && (
              <S.StrengthContainer>
                <S.StrengthBar>
                  <S.StrengthFill $strength={passwordStrength} />
                </S.StrengthBar>
                <S.StrengthText $strength={passwordStrength}>
                  Força da senha: <strong>{getStrengthLabel(passwordStrength)}</strong>
                </S.StrengthText>
              </S.StrengthContainer>
            )}

            <S.InputGroup>
              <S.InputIcon>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </S.InputIcon>
              <S.Input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Repita a Nova Senha" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <S.PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </S.PasswordToggle>
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