import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { ThemeContext } from "../../hooks/ThemeConfig";
import { AuthContext } from "../../hooks/AuthConfig";
import * as S from "./styles";

export default function FirstAccess() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Calcula a força da senha (0 a 5)
  const calculateStrength = (password) => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strengthScore = calculateStrength(newPassword);

  const getStrengthLabel = (score) => {
    if (score === 0) return { label: "", color: "transparent" };
    if (score <= 2) return { label: "Fraca", color: "#ef4444" }; // Vermelho
    if (score <= 4) return { label: "Média", color: "#f59e0b" }; // Amarelo/Laranja
    return { label: "Forte", color: "#10b981" }; // Verde
  };

  const strengthData = getStrengthLabel(strengthScore);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error("A nova senha e a confirmação não coincidem.");
    }

    if (strengthScore < 3) {
      return toast.warning("Por favor, crie uma senha mais forte.");
    }

    setLoading(true);
    
    try {
      // Faz a requisição para a rota que criamos no backend
      await api.put('/users/first-access', {
        oldPassword,
        newPassword,
        confirmPassword
      });

      toast.success("Senha atualizada com sucesso! Faça login novamente.");
      logout(); // Desloga o usuário para ele testar a nova senha
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erro ao atualizar a senha.";
      toast.error(errorMsg);
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
        <S.TopIconContainer>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </S.TopIconContainer>

        <S.HeaderBrand>
          <h1>Defina sua nova senha</h1>
          <p>Como este é o seu primeiro acesso,<br/>é necessário alterar a senha provisória.</p>
        </S.HeaderBrand>
        
        <S.Form onSubmit={handleSubmit}>
          
          <S.InputGroup>
            <S.InputIcon>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </S.InputIcon>
            <S.Input 
              type="password" 
              placeholder="Senha Atual (Provisória)" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.Divider />

          <S.InputGroup>
            <S.InputIcon>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </S.InputIcon>
            <S.Input 
              type="password" 
              placeholder="Nova Senha" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </S.InputGroup>

          {/* Medidor de Força da Senha */}
          {newPassword.length > 0 && (
            <S.StrengthContainer>
              <S.StrengthBar score={strengthScore} color={strengthData.color} />
              <S.StrengthLabel color={strengthData.color}>
                Força da senha: <strong>{strengthData.label}</strong>
              </S.StrengthLabel>
            </S.StrengthContainer>
          )}

          <S.InputGroup>
            <S.InputIcon>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </S.InputIcon>
            <S.Input 
              type="password" 
              placeholder="Confirme a Nova Senha" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.ButtonContainer>
            <S.Button type="submit" disabled={loading || newPassword !== confirmPassword || strengthScore < 3}>
              {loading ? "Atualizando..." : "Salvar Nova Senha"}
            </S.Button>
          </S.ButtonContainer>
        </S.Form>

      </S.LoginCard>
    </S.Container>
  );
}