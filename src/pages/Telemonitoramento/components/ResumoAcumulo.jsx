import React from 'react';
import styled from 'styled-components';

// 👇 ACUMULAR SOBRAS: resumo simples do estoque quando a sobra é somada à caixa
// nova — "caixa anterior + caixa nova = total". O total é o estoque projetado
// (o mesmo número usado na adesão); a caixa anterior é o que sobra dele além da
// caixa nova. Se a caixa anterior já acabou na projeção, a nova aparece "em uso".

const Linha = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: ${p => p.theme.space.xs};
  margin: ${p => p.theme.space.sm} 0;
`;

const Item = styled.div`
  flex: 1 1 90px;
  min-width: 90px;
  padding: ${p => p.theme.space.sm};
  border-radius: ${p => p.theme.radius.sm};
  border: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.$total ? p.theme.colors.successLight : p.theme.colors.surface};
  text-align: center;

  span { display: block; font-size: 0.75rem; line-height: 1.3; color: ${p => p.theme.colors.textLight}; }
  strong { display: block; margin-top: 2px; font-size: 1.15rem; color: ${p => p.theme.colors.text}; }
`;

const Sinal = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${p => p.theme.colors.textLight};
`;

const Nota = styled.p`
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.4;
  color: ${p => p.theme.colors.textLight};
`;

export default function ResumoAcumulo({ caixaNova, total }) {
  const nova = Math.max(0, Math.round(Number(caixaNova) || 0));
  const totalHoje = Math.max(0, Math.round(Number(total) || 0));
  const anterior = Math.max(0, totalHoje - nova);
  const novaHoje = Math.min(nova, totalHoje);
  const novaEmUso = novaHoje < nova;

  return (
    <div data-testid="resumo-acumulo" aria-label="Resumo do estoque com acumular sobras">
      <Linha>
        <Item>
          <span>Caixa anterior (sobra)</span>
          <strong>{anterior}</strong>
        </Item>
        <Sinal aria-hidden="true">+</Sinal>
        <Item>
          <span>{novaEmUso ? 'Caixa nova (já em uso)' : 'Caixa nova'}</span>
          <strong>{novaHoje}</strong>
        </Item>
        <Sinal aria-hidden="true">=</Sinal>
        <Item $total>
          <span>Total esperado com o paciente</span>
          <strong>{totalHoje}</strong>
        </Item>
      </Linha>
      <Nota>
        Acumular sobras ativado: confira com o paciente se ele tem cerca de {totalHoje} comprimidos no total
        {novaEmUso ? ' (a caixa anterior já acabou na projeção).' : ` — ${anterior} da caixa anterior + ${novaHoje} da caixa nova.`}
      </Nota>
    </div>
  );
}
