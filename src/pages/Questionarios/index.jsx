import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { 
    Container, Header, TemplateCard, CardHeader, StatusBadge, 
    Actions, ActionButton, DetailsContainer, QuestionList, 
    QuestionItem, WarningMessage 
} from './styles';

// CORREÇÃO AQUI: Trocamos LuAlertTriangle por LuTriangleAlert
import { LuChevronDown, LuChevronUp, LuTriangleAlert, LuPower, LuEye } from "react-icons/lu";
import { colors } from '../../themes/theme'; 
import TemplateModal from './components/TemplateModal';

const QuestionariosPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [expandedId, setExpandedId] = useState(null);

  const loadTemplates = async () => {
    try {
      const response = await api.get('/evaluations/templates');
      const sorted = response.data.sort((a, b) => Number(b.is_active) - Number(a.is_active));
      setTemplates(sorted);
      setLoading(false);
    } catch (err) {
      toast.error('Erro ao carregar questionários.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleToggleStatus = async (id, currentStatus, e) => {
    e.stopPropagation(); 
    const action = currentStatus ? "desativar" : "ativar";
    if (window.confirm(`Deseja realmente ${action} este questionário?`)) {
        try {
            await api.patch(`/evaluations/templates/${id}/status`);
            toast.success(`Questionário ${action === 'ativar' ? 'ativado' : 'desativado'}!`);
            loadTemplates();
        } catch (err) {
            toast.error("Erro ao alterar status.");
        }
    }
  };

  const toggleDetails = (id) => {
    if (expandedId === id) {
        setExpandedId(null); 
    } else {
        setExpandedId(id); 
    }
  };

  return (
    <Container>
      <Header>
        <h1>Questionários & Avaliações</h1>
        <button onClick={() => setIsModalOpen(true)}>+ Novo Questionário</button>
      </Header>

      {loading ? (
        <p>Carregando...</p>
      ) : templates.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>
            <h3>Nenhum questionário cadastrado.</h3>
        </div>
      ) : (
        templates.map(template => (
            <TemplateCard 
                key={template.id} 
                isActive={template.is_active}
                isExpanded={expandedId === template.id}
            >
                <CardHeader>
                    <div className="info">
                        <h3>
                            {template.title}
                            <StatusBadge isActive={template.is_active}>
                                {template.is_active ? 'Ativo' : 'Inativo'}
                            </StatusBadge>
                        </h3>
                        <p>{template.description || "Sem descrição definida."}</p>
                        <small style={{ color: '#888', marginTop: '5px', display: 'block' }}>
                            {template.questions?.length || 0} perguntas configuradas
                        </small>
                    </div>
                    
                    <Actions>
                        <ActionButton 
                            color={template.is_active ? colors.danger : 'green'}
                            onClick={(e) => handleToggleStatus(template.id, template.is_active, e)}
                        >
                            <LuPower size={16} />
                            {template.is_active ? 'Desativar' : 'Ativar'}
                        </ActionButton>

                        <ActionButton 
                            onClick={() => toggleDetails(template.id)}
                            color={colors.primary}
                        >
                            {expandedId === template.id ? <LuChevronUp size={18} /> : <LuEye size={18} />}
                            {expandedId === template.id ? 'Fechar' : 'Detalhes'}
                        </ActionButton>
                    </Actions>
                </CardHeader>

                {expandedId === template.id && (
                    <DetailsContainer>
                        <h4 style={{ marginBottom: '1rem', color: '#555' }}>Estrutura do Formulário</h4>
                        
                        <QuestionList>
                            {template.questions && template.questions.map((q, idx) => (
                                <QuestionItem key={q.id || idx}>
                                    <div className="q-header">
                                        <strong>{idx + 1}. {q.enunciado}</strong>
                                        <span className="type">
                                            {q.tipo === 'multipla_escolha' ? 'Múltipla Escolha' : 'Texto Livre'}
                                        </span>
                                    </div>

                                    {q.tipo === 'multipla_escolha' && q.options && (
                                        <div className="q-options">
                                            <ul>
                                                {q.options.map((opt, optIdx) => (
                                                    <li key={opt.id || optIdx}>
                                                        <span>• {opt.label}</span>
                                                        <span className="score">{opt.score} pts</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </QuestionItem>
                            ))}
                        </QuestionList>

                        <WarningMessage>
                            {/* CORREÇÃO AQUI TAMBÉM: Usando o novo nome */}
                            <LuTriangleAlert size={20} />
                            <span>
                                Os questionários não são editáveis para manter a integridade histórica dos dados 
                                dos pacientes que já responderam a esta avaliação. Caso precise alterar, 
                                desative este e crie um novo.
                            </span>
                        </WarningMessage>
                    </DetailsContainer>
                )}
            </TemplateCard>
        ))
      )}

      <TemplateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadTemplates}
      />
    </Container>
  );
};

export default QuestionariosPage;