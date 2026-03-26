import React from 'react';
import { LuInfo } from 'react-icons/lu';
import * as S from './styles';
import rulesData from './rules.json'; // Importa o JSON que criamos

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>
          <LuInfo size={24} color="#1890ff" /> 
          Regras de Uso do Chat
        </h2>
        
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {rulesData.map((rule) => (
            <S.RuleItem key={rule.id}>
              <h4>{rule.id}. {rule.title}</h4>
              <p>{rule.description}</p>
            </S.RuleItem>
          ))}
        </div>

        <S.CloseButton onClick={onClose}>
          Entendido
        </S.CloseButton>
      </S.ModalContent>
    </S.ModalOverlay>
  );
}