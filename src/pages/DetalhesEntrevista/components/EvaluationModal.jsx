import React from 'react';
import { Overlay, ModalContainer, CloseButton, ScoreHeader, QuestionItem } from './styles';
import { useEffect } from 'react';

export default function EvaluationModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  // Extraímos os objetos paciente e médico de dentro do data
  const { avaliacoes, paciente, data_contato } = data; 
  const avaliacoesList = avaliacoes || [];

 

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        
        {/* Mostramos o nome do paciente usando o objeto extraído */}
        <h2>Histórico de Avaliações: {paciente?.nome} {paciente?.sobrenome}</h2>
        <p className="subtitle">Data da Entrevista: {data_contato}</p>

        {avaliacoesList.length === 0 ? (
          <p className="empty-message">Nenhuma avaliação encontrada para esta entrevista.</p>
        ) : (
          avaliacoesList.map((aval, index) => (
            <div key={aval.id} className="evaluation-block">
              
              <h3>
                {aval.template?.title || `Questionário ${index + 1}`}
              </h3>

              <ScoreHeader>
                <div>
                  <span>Pontuação do Questionário</span>
                  <strong>{aval.total_score} pts</strong>
                </div>
             
              </ScoreHeader>

              <h4>Respostas Registradas</h4>
              
              {(aval.answers || []).map(ans => (
                <QuestionItem key={ans.id}>
                  <h5>{ans.question?.enunciado}</h5>
                  <div className="answer-box">
                    <span>
                      {ans.option ? ans.option.label : (ans.text_answer || 'Sem resposta')}
                    </span>
                    {ans.computed_score > 0 && (
                      <span className="score-tag">
                        +{ans.computed_score} pts
                      </span>
                    )}
                  </div>
                </QuestionItem>
              ))}

            </div>
          ))
        )}

      </ModalContainer>
    </Overlay>
  );
}