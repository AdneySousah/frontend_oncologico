import React, { useState, useEffect } from 'react';
import { Overlay, ModalContainer, CloseButton, ScoreHeader, QuestionItem } from './styles';

export default function EvaluationModal({ isOpen, onClose, data }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [groupedEvaluations, setGroupedEvaluations] = useState({});

  useEffect(() => {
    if (data) {
      // Extrai as avaliações (seja vindo de data.avaliacoes ou de um array direto)
      const avaliacoesList = data.avaliacoes || data || [];
      
      // Agrupa as avaliações pela data de criação (createdAt)
      const groups = {};
      
      if (Array.isArray(avaliacoesList)) {
        avaliacoesList.forEach(aval => {
          if (!aval.createdAt) return;
          
          const dateObj = new Date(aval.createdAt);
          const dateKey = dateObj.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY

          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(aval);
        });
      }

      setGroupedEvaluations(groups);

      // Ordena as datas disponíveis (da mais recente para a mais antiga)
      const dates = Object.keys(groups).sort((a, b) => {
        const [d1, m1, y1] = a.split('/');
        const [d2, m2, y2] = b.split('/');
        return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
      });

      // Pré-seleciona a avaliação mais recente automaticamente
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      } else {
        setSelectedDate('');
      }
    }
  }, [data]);

  if (!isOpen || !data) return null;

  // Garante que pegamos o objeto do paciente de forma segura
  const paciente = data.paciente || data;
  const currentEvaluations = groupedEvaluations[selectedDate] || [];
  
  // Lista de datas ordenadas para o `<select>`
  const availableDates = Object.keys(groupedEvaluations).sort((a, b) => {
    const [d1, m1, y1] = a.split('/');
    const [d2, m2, y2] = b.split('/');
    return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
  });

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        
        <h2>Histórico de Avaliações: {paciente?.nome} {paciente?.sobrenome}</h2>

        {/* Seletor de Entrevistas por Data */}
        {availableDates.length > 0 ? (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Data da Entrevista:</label>
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
            >
              {availableDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
        ) : (
          <p className="subtitle">Data da Entrevista: Nenhuma avaliação registrada.</p>
        )}

        {/* Renderização das avaliações pertencentes APENAS à data selecionada */}
        {currentEvaluations.length === 0 && availableDates.length > 0 ? (
          <p className="empty-message">Nenhuma avaliação encontrada para esta data.</p>
        ) : (
          currentEvaluations.map((aval, index) => (
            <div key={aval.id} className="evaluation-block">
              
              <h3>
                {aval.template?.title || `Questionário ${index + 1}`}
              </h3>

              <ScoreHeader>
                <div>
                  <span>Pontuação do Questionário</span>
                  <strong>{aval.total_score || 0} pts</strong>
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