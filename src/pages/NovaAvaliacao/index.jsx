import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  LuUser, LuCalculator, LuMapPin, LuPhone,
  LuChevronRight, LuChevronLeft, LuCheck, LuInfo
} from "react-icons/lu";

import AvaliacaoModal from './component/AvaliacaoModal';

import {
  Container, Title, Form, QuestionCard, Select, Button,
  Input, AlertBox, ButtonCancel, SectionWrapper, SummaryCard,
  SummaryHeader, SummaryGrid, InfoGroup, InfoItem,
  SummaryDivider, FloatingScore,
  ProgressBarContainer, ProgressBarFill, ProgressText,
  CategoryTitle, FormFooter, StepperHeader, OrientacaoText
} from './styles';

export default function NovaAvaliacao() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paciente_id = searchParams.get('paciente_id');

  const [pendingTemplates, setPendingTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [pacienteData, setPacienteData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Estados para o Modal e Paginação
  const [modalOpen, setModalOpen] = useState(false);
  const [scoreFinal, setScoreFinal] = useState(0);
  const [evaluationId, setEvaluationId] = useState(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    if (paciente_id) {
      fetchData();
    } else {
      toast.error("Paciente não identificado.");
      navigate('/necessidade-navegacao');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paciente_id]);

  async function fetchData() {
    try {
      setLoading(true);
      const [templatesRes, pacienteRes] = await Promise.all([
        api.get(`/evaluations/templates/pending/${paciente_id}`),
        api.get(`/pacientes/detalhes/${paciente_id}`)
      ]);

      setPendingTemplates(templatesRes.data);
      setPacienteData(pacienteRes.data);

      if (templatesRes.data.length > 0) {
        setSelectedTemplateId(templatesRes.data[0].id);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  }

  // Sempre que mudar de questionário, reseta a página e as respostas
  useEffect(() => {
    setCurrentCategoryIndex(0);
    setAnswers({});
  }, [selectedTemplateId]);

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

  const activeTemplate = pendingTemplates.find(t => t.id === Number(selectedTemplateId));



  // Agrupa as perguntas por categoria
  const groupedCategories = useMemo(() => {
    if (!activeTemplate || !activeTemplate.questions) return [];

    // 1. Criamos uma cópia para não mutar o estado original e ordenamos por ID crescente
    const sortedQuestions = [...activeTemplate.questions].sort((a, b) => a.id - b.id);

    const groups = {};

    // 2. Usamos o array já ordenado para montar os grupos
    sortedQuestions.forEach(q => {
      const cat = q.categoria || 'Geral';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(q);
    });

    // Retorna um array de objetos { name: 'Nome da Categoria', questions: [...] }
    return Object.entries(groups).map(([name, qs]) => ({ name, questions: qs }));
  }, [activeTemplate]);

  // Calcula o progresso global (ignorando tipo "orientacao")
  const { totalAnswerable, answeredCount, progressPercentage } = useMemo(() => {
    if (!activeTemplate || !activeTemplate.questions) return { totalAnswerable: 0, answeredCount: 0, progressPercentage: 0 };

    const answerable = activeTemplate.questions.filter(q => q.tipo !== 'orientacao');
    const answered = answerable.filter(q => answers[q.id] && (answers[q.id].option_selected_id || (answers[q.id].text_answer && answers[q.id].text_answer.trim() !== '')));

    const progress = answerable.length > 0 ? Math.round((answered.length / answerable.length) * 100) : 0;

    return { totalAnswerable: answerable.length, answeredCount: answered.length, progressPercentage: progress };
  }, [activeTemplate, answers]);

  // Valida se todas as perguntas da categoria atual foram respondidas
  const canAdvance = () => {
    const currentCat = groupedCategories[currentCategoryIndex];
    if (!currentCat) return false;

    const answerableInCat = currentCat.questions.filter(q => q.tipo !== 'orientacao');
    const answeredInCat = answerableInCat.filter(q => answers[q.id] && (answers[q.id].option_selected_id || (answers[q.id].text_answer && answers[q.id].text_answer.trim() !== '')));

    return answeredInCat.length === answerableInCat.length;
  };

  const handleNext = (e) => {
    e.preventDefault(); // Impede recarregamento e comportamentos estranhos
    if (!canAdvance()) {
      toast.warn("Por favor, responda todos os itens desta etapa antes de avançar.");
      return;
    }
    setCurrentCategoryIndex(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = (e) => {
    e.preventDefault(); // Impede recarregamento
    setCurrentCategoryIndex(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Impede recarregamento da página

    if (!canAdvance() || answeredCount < totalAnswerable) {
      toast.warn("Por favor, preencha todo o formulário antes de enviar.");
      return;
    }

    const respostasArray = activeTemplate.questions.map(q => {
      if (answers[q.id]) return answers[q.id];
      return { question_id: q.id, option_selected_id: null, text_answer: null };
    });

    const payload = {
      paciente_id: Number(paciente_id),
      template_id: Number(selectedTemplateId),
      entrevista_profissional_id: null,
      respostas: respostasArray,
      data_proxima_consulta: null,
      consulta: null,
      observacoes: null
    };

    try {
      const res = await api.post('/evaluations/responses', payload);
      setScoreFinal(res.data.evaluation.total_score);
      setEvaluationId(res.data.evaluation.id);

      toast.success('Avaliação enviada com sucesso!');
      setPendingTemplates(prev => prev.filter(t => t.id !== Number(selectedTemplateId)));
      setAnswers({});
      setModalOpen(true);
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

  const currentLiveScore = useMemo(() => {
    if (!activeTemplate) return 0;
    let total = 0;
    Object.values(answers).forEach(ans => {
      if (ans.option_selected_id) {
        const question = activeTemplate.questions.find(q => q.id === ans.question_id);
        if (question && question.options) {
          const option = question.options.find(o => o.id === ans.option_selected_id);
          if (option && option.score) {
            total += Number(option.score);
          }
        }
      }
    });
    return total;
  }, [answers, activeTemplate]);

  if (loading) return <div style={{ padding: 20, textAlign: 'center', fontSize: '1.2rem' }}>Carregando dados da avaliação...</div>;

  if (pendingTemplates.length === 0 && !modalOpen) {
    return (
      <Container>
        <SectionWrapper>
          <Title>Todas as avaliações foram concluídas.</Title>
          <Button onClick={() => navigate('/necessidade-navegacao')}>Voltar para a Lista</Button>
        </SectionWrapper>
      </Container>
    );
  }

  const currentCategory = groupedCategories[currentCategoryIndex];
  const isLastCategory = currentCategoryIndex === groupedCategories.length - 1;

  return (
    <Container>
      <SectionWrapper>
        <Title>Realizar Avaliação</Title>

        <AlertBox>
          ⚠️ ATENÇÃO: NUNCA falar sobre o diagnóstico com o paciente.
        </AlertBox>

        {pacienteData && (
          <SummaryCard>
            <SummaryHeader>
              <LuUser size={26} /> Dados do Paciente
            </SummaryHeader>

            <SummaryGrid>
              <InfoGroup>
                <InfoItem>
                  <strong>Nome Completo:</strong>
                  {pacienteData.nome} {pacienteData.sobrenome}
                </InfoItem>
                <InfoItem>
                  <strong>CPF:</strong>
                  {pacienteData.cpf}
                </InfoItem>
                <InfoItem>
                  <strong>Data de Nascimento:</strong>
                  {formatarData(pacienteData.data_nascimento)}
                </InfoItem>
                <InfoItem>
                  <strong>Operadora:</strong>
                  {pacienteData.operadoras?.nome || pacienteData.operadora?.nome || '-'}
                </InfoItem>
              </InfoGroup>

              <InfoGroup>
                <InfoItem>
                  <strong><LuPhone size={18} /> Contatos:</strong>
                  Cel: {pacienteData.celular || '-'} {pacienteData.telefone ? ` / Tel: ${pacienteData.telefone}` : ''}
                </InfoItem>
                <InfoItem>
                  <strong><LuMapPin size={18} /> Endereço:</strong>
                  {pacienteData.cidade} - {pacienteData.estado}
                </InfoItem>
                <InfoItem>
                  <strong>Possui Cuidador?</strong>
                  {pacienteData.possui_cuidador ? `Sim (${pacienteData.nome_cuidador || 'Nome não informado'})` : 'Não'}
                </InfoItem>
              </InfoGroup>
            </SummaryGrid>
            <SummaryDivider />
          </SummaryCard>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
            Selecione o Questionário Pendente:
          </label>
          <Select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          >
            {pendingTemplates.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </Select>
        </div>

        {activeTemplate && currentCategory && (
          <Form as="div">
            <StepperHeader>
              <div className="title-area">
                <h3>{activeTemplate.title}</h3>
                <p>{activeTemplate.description}</p>
              </div>
              <div className="progress-area">
                <ProgressText>
                  Progresso: {progressPercentage}%
                  <span>({answeredCount} de {totalAnswerable} respondidas)</span>
                </ProgressText>
                <ProgressBarContainer>
                  <ProgressBarFill progress={progressPercentage} />
                </ProgressBarContainer>
              </div>
            </StepperHeader>

            <CategoryTitle>
              Etapa {currentCategoryIndex + 1} de {groupedCategories.length}: <span>{currentCategory.name}</span>
            </CategoryTitle>

            {currentCategory.questions.map((q, index) => (
              <QuestionCard key={q.id} isOrientacao={q.tipo === 'orientacao'}>
                {q.tipo === 'orientacao' ? (
                  <OrientacaoText>
                    <LuInfo size={24} />
                    <span>{q.enunciado}</span>
                  </OrientacaoText>
                ) : (
                  <>
                    <h4>{q.enunciado}</h4>
                    {q.tipo === 'multipla_escolha' ? (
                      <div className="options-group">
                        {q.options.map(opt => (
                          <label key={opt.id} className={answers[q.id]?.option_selected_id === opt.id ? 'selected' : ''}>
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={opt.id}
                              checked={answers[q.id]?.option_selected_id === opt.id}
                              onChange={() => handleOptionChange(q.id, opt.id)}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <Input
                        type="text"
                        placeholder="Digite a resposta..."
                        value={answers[q.id]?.text_answer || ''}
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                      />
                    )}
                  </>
                )}
              </QuestionCard>
            ))}

            <FormFooter>
              <div>
                {currentCategoryIndex > 0 && (
                  <Button type="button" variant="secondary" onClick={handlePrev}>
                    <LuChevronLeft size={20} /> Voltar Etapa
                  </Button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <ButtonCancel type="button" onClick={() => navigate('/necessidade-navegacao')}>
                  Sair
                </ButtonCancel>

                {!isLastCategory ? (
                  <Button type="button" className="btn-next" onClick={handleNext}>
                    Próxima Etapa <LuChevronRight size={20} />
                  </Button>
                ) : (
                  <Button type="button" className="btn-success" onClick={handleSubmit}>
                    <LuCheck size={20} /> Enviar Avaliação
                  </Button>
                )}
              </div>
            </FormFooter>
          </Form>
        )}

        <AvaliacaoModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          scoreFinal={scoreFinal}
          pacienteData={pacienteData}
          pacienteId={paciente_id}
          evaluationId={evaluationId}
          pendingTemplatesCount={pendingTemplates.length}
        />

      </SectionWrapper>

      {activeTemplate && activeTemplate.questions.length > 0 && (
        <FloatingScore>
          <LuCalculator size={28} />
          Score Atual: <span>{currentLiveScore}</span>
        </FloatingScore>
      )}

    </Container>
  );
}