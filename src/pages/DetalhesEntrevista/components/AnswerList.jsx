import React from 'react';
import { Section, AnswerContainer, QuestionText, AnswerText, Title } from '../styles';

export default function AnswerList({ answers }) {
  if (!answers || answers.length === 0) return null;

  return (
    <Section>
      <Title>Detalhamento da Avaliação</Title>
      
      {answers.map((item) => (
        <AnswerContainer key={item.id} score={item.computed_score}>
          {/* Acessa a pergunta via include do Sequelize */}
          <QuestionText>
            {item.question ? item.question.enunciado : "Pergunta não encontrada"}
          </QuestionText>

          <AnswerText>
            <div>
              <span style={{ marginRight: 8 }}>Resposta:</span>
              
              {/* Lógica: Se tem option, mostra label. Se não, mostra texto livre */}
              {item.option ? (
                <span className="option-label">{item.option.label}</span>
              ) : (
                <span className="text-answer">
                  {item.text_answer || <em>Sem resposta</em>}
                </span>
              )}
            </div>

            {/* Mostra pontuação se for maior que 0 ou se for do tipo múltipla escolha */}
            {item.computed_score !== null && (
               <span className="score-val">
                 +{item.computed_score} pts
               </span>
            )}
          </AnswerText>
        </AnswerContainer>
      ))}
    </Section>
  );
}