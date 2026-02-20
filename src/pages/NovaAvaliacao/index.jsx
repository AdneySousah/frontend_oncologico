// src/pages/NovaAvaliacao/index.jsx
import React, { useState, useEffect, useMemo } from 'react'; // <-- Adicionado useMemo
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
// <-- Adicionado LuCalculator para o botão flutuante
import { LuUser, LuStethoscope, LuClipboardList, LuPill, LuFileText, LuCalculator } from "react-icons/lu";

import {
  Container, Title, Form, QuestionCard, Select, Button, ModalOverlay,
  ModalContent, SuccessCheck, Input, AlertBox, ButtonCancel,
  SectionWrapper, SummaryCard, SummaryHeader, SummaryGrid, InfoGroup,
  InfoItem, SummaryDivider, ObservationBox, ListStyled,
  FloatingScore // <-- Adicionado o novo estilo importado
} from './styles';

export default function NovaAvaliacao() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const entrevista_id = searchParams.get('entrevista_id');
  const paciente_id = searchParams.get('paciente_id');

  const [pendingTemplates, setPendingTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [entrevistaData, setEntrevistaData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [scoreFinal, setScoreFinal] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      const [templatesRes, entrevistaRes] = await Promise.all([
        api.get(`/evaluations/templates/pending/${entrevista_id}`),
        api.get(`/entrevistas-medicas/${entrevista_id}`)
      ]);

      setPendingTemplates(templatesRes.data);
      setEntrevistaData(entrevistaRes.data);

      if (templatesRes.data.length > 0) {
        setSelectedTemplateId(templatesRes.data[0].id);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  }

  const handleOptionChange = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { question_id: questionId, option_selected_id: optionId, text_answer: null }
    }));
  };

  const handleTextChange = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { question_id: questionId, option_selected_id: null, text_answer: text }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTemplate = pendingTemplates.find(t => t.id === Number(selectedTemplateId));
    if (!currentTemplate) return;

    const respostasArray = currentTemplate.questions.map(q => {
      if (answers[q.id]) return answers[q.id];
      return { question_id: q.id, option_selected_id: null, text_answer: null };
    });

    const payload = {
      paciente_id: Number(paciente_id),
      template_id: Number(selectedTemplateId),
      entrevista_profissional_id: Number(entrevista_id),
      respostas: respostasArray,
      data_proxima_consulta: null,
      consulta: null,
      observacoes: null
    };

    try {
      const res = await api.post('/evaluations/responses', payload);
      setScoreFinal(res.data.evaluation.total_score);
      setModalOpen(true);
      toast.success('Avaliação enviada com sucesso!');
      setPendingTemplates(prev => prev.filter(t => t.id !== Number(selectedTemplateId)));
      setAnswers({});
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao enviar avaliação.';
      toast.error(errorMsg);
    }
  };

  const handleCloseModal = (continuar) => {
    setModalOpen(false);
    if (continuar && pendingTemplates.length > 0) {
      setSelectedTemplateId(pendingTemplates[0].id);
    } else {
      navigate('/necessidade-navegacao');
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    return dataStr.split('-').reverse().join('/');
  };

  const activeTemplate = pendingTemplates.find(t => t.id === Number(selectedTemplateId));

  // ==========================================
  // NOVO: CALCULAR PONTUAÇÃO EM TEMPO REAL
  // ==========================================
  const currentLiveScore = useMemo(() => {
    if (!activeTemplate) return 0;
    let total = 0;
    
    // Itera sobre todas as respostas que o usuário já clicou
    Object.values(answers).forEach(ans => {
      // Se a resposta for de múltipla escolha (tem um option_selected_id)
      if (ans.option_selected_id) {
        // Encontra a pergunta original no template
        const question = activeTemplate.questions.find(q => q.id === ans.question_id);
        if (question && question.options) {
          // Encontra a opção original dentro da pergunta para pegar o Score
          const option = question.options.find(o => o.id === ans.option_selected_id);
          if (option && option.score) {
            total += Number(option.score);
          }
        }
      }
    });
    
    return total;
  }, [answers, activeTemplate]); 
  // O cálculo refaz toda vez que 'answers' ou 'activeTemplate' mudar.

  if (loading) return <div style={{ padding: 20, textAlign: 'center', fontSize: '1.2rem' }}>Carregando dados da avaliação...</div>;

  if (pendingTemplates.length === 0 && !modalOpen) {
    return (
      <Container>
        <SectionWrapper>
          <Title>Todas as avaliações foram concluídas.</Title>
          <Button onClick={() => navigate('/necessidade-navegacao')}>Voltar para Entrevistas</Button>
        </SectionWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <SectionWrapper>
        <Title>Realizar Avaliação</Title>

        <AlertBox>
          ⚠️ ATENÇÃO: NUNCA falar sobre o diagnóstico com o paciente.
        </AlertBox>

        {entrevistaData && (
          <SummaryCard>
            <SummaryHeader>
              <LuUser size={26} /> Resumo do Paciente e Entrevista Base
            </SummaryHeader>

            <SummaryGrid>
              <InfoGroup>
                <InfoItem>
                  <strong>Paciente:</strong> 
                  {entrevistaData.paciente?.nome} {entrevistaData.paciente?.sobrenome} (CPF: {entrevistaData.paciente?.cpf})
                </InfoItem>
                <InfoItem>
                  <strong>Data de Nascimento:</strong> 
                  {formatarData(entrevistaData.paciente?.data_nascimento)}
                </InfoItem>
                <InfoItem style={{ marginTop: '10px' }}>
                  <strong><LuStethoscope size={18} /> Médico Responsável:</strong> 
                  {entrevistaData.medico?.nome} (CRM: {entrevistaData.medico?.crm || 'N/A'})
                </InfoItem>
                <InfoItem>
                  <strong>Local:</strong> 
                  {entrevistaData.prestador_medico?.nome}
                </InfoItem>
              </InfoGroup>

              <InfoGroup>
                <InfoItem>
                  <strong><LuClipboardList size={18} /> Diagnóstico (CID):</strong> 
                  {entrevistaData.diagnostico_cid?.diagnostico || '-'}
                </InfoItem>
                <InfoItem>
                  <strong>Estadiamento:</strong> Grau {entrevistaData.estadiamento}
                </InfoItem>
                <InfoItem>
                  <strong>Data do Contato:</strong> {formatarData(entrevistaData.data_contato)}
                </InfoItem>
              </InfoGroup>
            </SummaryGrid>

            <SummaryDivider />

            <SummaryGrid>
              <InfoGroup>
                <InfoItem>
                  <strong><LuFileText size={18} /> Comorbidades:</strong>
                </InfoItem>
                {entrevistaData.infos_comorbidade?.possui_comorbidade ? (
                  <ListStyled>
                    <li>{entrevistaData.infos_comorbidade.comorbidade_mestre?.nome}</li>
                    {entrevistaData.infos_comorbidade.sabe_diagnostico && (
                      <li className="obs">Obs: Paciente sabe do diagnóstico. Descrição: {entrevistaData.infos_comorbidade.descricao_diagnostico}</li>
                    )}
                  </ListStyled>
                ) : (
                  <span style={{ color: '#888', marginLeft: '5px' }}>Nenhuma relatada.</span>
                )}
              </InfoGroup>

              <InfoGroup>
                <InfoItem>
                  <strong><LuPill size={18} /> Medicamento Contínuo:</strong>
                </InfoItem>
                {entrevistaData.infos_medicamento?.possui_medicamento ? (
                  <ListStyled>
                    <li>{entrevistaData.infos_medicamento.medicamento_mestre?.nome} ({entrevistaData.infos_medicamento.medicamento_mestre?.dosagem})</li>
                  </ListStyled>
                ) : (
                  <span style={{ color: '#888', marginLeft: '5px' }}>Nenhum uso contínuo relatado.</span>
                )}
              </InfoGroup>
            </SummaryGrid>

            {entrevistaData.observacoes && (
              <>
                <SummaryDivider />
                <InfoGroup>
                  <InfoItem><strong>Observações Gerais da Entrevista:</strong></InfoItem>
                  <ObservationBox>
                    {entrevistaData.observacoes}
                  </ObservationBox>
                </InfoGroup>
              </>
            )}
          </SummaryCard>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
            Selecione o Questionário Pendente:
          </label>
          <Select
            value={selectedTemplateId}
            onChange={(e) => {
              setSelectedTemplateId(e.target.value);
              setAnswers({});
            }}
          >
            {pendingTemplates.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </Select>
        </div>

        {activeTemplate && (
          <Form onSubmit={handleSubmit}>
            <h3>{activeTemplate.title}</h3>
            <p style={{ marginBottom: 25, opacity: 0.8 }}>{activeTemplate.description}</p>

            {activeTemplate.questions.map((q, index) => (
              <QuestionCard key={q.id}>
                <h4>{index + 1}. {q.enunciado}</h4>

                {q.tipo === 'multipla_escolha' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {q.options.map(opt => (
                      <label key={opt.id}>
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          value={opt.id}
                          // IMPORTANTE: Manter o onChange atualizando o state answers
                          onChange={() => handleOptionChange(q.id, opt.id)} 
                          required
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : (
                  <Input
                    type="text"
                    placeholder="Digite a resposta..."
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    required
                  />
                )}
              </QuestionCard>
            ))}

            <Button type="submit">Enviar Respostas</Button>
            <ButtonCancel type="button" onClick={() => { navigate('/necessidade-navegacao') }}>Cancelar</ButtonCancel>
          </Form>
        )}

        {/* MODAL DE SUCESSO */}
        {modalOpen && (
          <ModalOverlay>
            <ModalContent>
              <SuccessCheck viewBox="0 0 52 52">
                <circle className="check-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </SuccessCheck>

              <h2>Avaliação Enviada!</h2>
              <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                Pontuação calculada: <strong>{scoreFinal} pts</strong>
              </p>

              {pendingTemplates.length > 0 ? (
                <>
                  <p style={{ margin: '25px 0', color: '#e67e22', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Existem mais {pendingTemplates.length} questionário(s) pendente(s). Deseja responder agora?
                  </p>
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Button onClick={() => handleCloseModal(true)}>Sim, Continuar</Button>
                    <Button variant="secondary" onClick={() => handleCloseModal(false)}>Não, Voltar</Button>
                  </div>
                </>
              ) : (
                <Button style={{ marginTop: 25 }} onClick={() => handleCloseModal(false)}>Voltar à Tabela</Button>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </SectionWrapper>

      {/* ============================================================== */}
      {/* NOVO: COMPONENTE FLUTUANTE EXIBINDO A PONTUAÇÃO (APENAS SE O TEMPLATE TIVER PERGUNTAS) */}
      {/* ============================================================== */}
      {activeTemplate && activeTemplate.questions.length > 0 && (
        <FloatingScore>
           <LuCalculator size={28} />
           Score Atual: <span>{currentLiveScore}</span>
        </FloatingScore>
      )}

    </Container>
  );
}