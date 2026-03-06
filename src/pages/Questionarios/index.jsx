import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
    Container, Header, TemplateCard, CardHeader, StatusBadge,
    Actions, ActionButton, DetailsContainer, QuestionList,
    QuestionItem, WarningMessage
} from './styles';

import { LuChevronDown, LuChevronUp, LuTriangleAlert, LuPower, LuEye, LuPencil, LuInfo } from "react-icons/lu";
import { colors } from '../../themes/theme';
import TemplateModal from './components/TemplateModal';

const QuestionariosPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState(null);

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

    const openNewModal = () => {
        setTemplateToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (template) => {
        setTemplateToEdit(template);
        setIsModalOpen(true);
    };

    // Função auxiliar para agrupar perguntas por Categoria
    const groupByCategory = (questions) => {
        if (!questions) return {};
        return questions.reduce((acc, q) => {
            const cat = q.categoria || 'Geral';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(q);
            return acc;
        }, {});
    };

    return (
        <Container>
            <Header>
                <h1>Questionários & Avaliações</h1>
                <button onClick={openNewModal}>+ Novo Questionário</button>
            </Header>

            {loading ? (
                <p>Carregando...</p>
            ) : templates.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>
                    <h3>Nenhum questionário cadastrado.</h3>
                </div>
            ) : (
                templates.map(template => {
                    const groupedQuestions = groupByCategory(template.questions);

                    return (
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

                                        {!template.is_editable && (
                                            <span style={{ fontSize: '12px', color: '#f39c12', marginLeft: '10px', fontWeight: 'normal' }}>
                                                (Uso Registrado - Bloqueado p/ Edição)
                                            </span>
                                        )}
                                    </h3>
                                    <p>{template.description || "Sem descrição definida."}</p>
                                    <small style={{ color: '#888', marginTop: '5px', display: 'block' }}>
                                        {template.questions?.length || 0} itens configurados
                                    </small>
                                </div>

                                <Actions>
                                    {template.is_editable && (
                                        <ActionButton
                                            color="#f39c12"
                                            onClick={() => openEditModal(template)}
                                            title="Editar Questionário"
                                        >
                                            <LuPencil size={16} />
                                            Editar
                                        </ActionButton>
                                    )}

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
                                    <h4 style={{ marginBottom: '1.5rem', color: '#555' }}>Estrutura do Formulário</h4>

                                    {/* Renderiza agrupado por Categoria */}
                                    {Object.entries(groupedQuestions).map(([categoria, qs]) => (
                                        <div key={categoria} style={{ marginBottom: '2rem' }}>
                                            {categoria !== 'Geral' && (
                                                <h5 style={{
                                                    backgroundColor: '#e9ecef',
                                                    padding: '8px 15px',
                                                    borderRadius: '4px',
                                                    color: '#343a40',
                                                    marginBottom: '10px'
                                                }}>
                                                    Categoria: {categoria}
                                                </h5>
                                            )}

                                            <QuestionList>
                                                {qs.map((q, idx) => (
                                                    <QuestionItem key={q.id || idx} style={q.tipo === 'orientacao' ? { borderLeft: '3px solid #17a2b8', backgroundColor: '#f8f9fa' } : {}}>
                                                        <div className="q-header">
                                                            <strong>
                                                                {q.tipo === 'orientacao' ? <LuInfo style={{ marginRight: '5px', color: '#17a2b8' }} /> : `${idx + 1}. `}
                                                                {q.enunciado}
                                                            </strong>
                                                            <span className="type" style={q.tipo === 'orientacao' ? { color: '#17a2b8', background: 'transparent' } : {}}>
                                                                {q.tipo === 'multipla_escolha' ? 'Múltipla Escolha' : q.tipo === 'texto' ? 'Texto Livre' : 'Observação'}
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
                                        </div>
                                    ))}

                                    <WarningMessage>
                                        <LuTriangleAlert size={20} />
                                        <span>
                                            Os questionários só podem ser editados <strong>antes</strong> de receberem a primeira resposta.
                                            Após o uso, eles são travados para manter a integridade histórica dos dados dos pacientes.
                                            Caso precise alterar algo em um questionário bloqueado, desative-o e crie um novo.
                                        </span>
                                    </WarningMessage>
                                </DetailsContainer>
                            )}
                        </TemplateCard>
                    );
                })
            )}


            <TemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadTemplates}
                templateToEdit={templateToEdit}
            />
        </Container>
    );
};

export default QuestionariosPage;