import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Overlay, ModalContainer, ModalHeader, ModalBody, ModalFooter, 
  Section, QuestionCard, QuestionHeader, QuestionNumber, OptionsArea, OptionRow, 
  Button, Select, Input, Label, Textarea,
  QuestionCategoryWrapper, QuestionTypeWrapper, QuestionTextWrapper, 
  DeleteButtonWrapper, FormSectionHeader
} from './styles';
import { LuTrash2, LuPlus, LuX } from "react-icons/lu";
import api from '../../../services/api';

const TemplateModal = ({ isOpen, onClose, onSuccess, templateToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [questions, setQuestions] = useState([
    { categoria: '', enunciado: '', tipo: 'texto', options: [] } 
  ]);

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title || '');
      setDescription(templateToEdit.description || '');
      
      if (templateToEdit.questions && templateToEdit.questions.length > 0) {
        setQuestions(templateToEdit.questions.map(q => ({
          categoria: q.categoria || '',
          enunciado: q.enunciado,
          tipo: q.tipo,
          options: q.options ? q.options.map(o => ({ label: o.label, score: o.score })) : []
        })));
      } else {
        setQuestions([{ categoria: '', enunciado: '', tipo: 'texto', options: [] }]);
      }
    } else {
      setTitle('');
      setDescription('');
      setQuestions([{ categoria: '', enunciado: '', tipo: 'texto', options: [] }]);
    }
  }, [templateToEdit, isOpen]);

  if (!isOpen) return null;

  const addQuestion = () => {
    const lastCategory = questions.length > 0 ? questions[questions.length - 1].categoria : '';
    setQuestions([...questions, { categoria: lastCategory, enunciado: '', tipo: 'texto', options: [] }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    
    if ((field === 'tipo' && value === 'texto') || (field === 'tipo' && value === 'orientacao')) {
        newQuestions[index].options = [];
    }
    if (field === 'tipo' && value === 'multipla_escolha' && newQuestions[index].options.length === 0) {
        newQuestions[index].options.push({ label: '', score: 0 });
    }
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ label: '', score: 0 });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, optIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast.warn("Dê um título ao questionário.");
    
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.enunciado.trim()) return toast.warn(`A pergunta ${i + 1} precisa de um enunciado/texto.`);
        if (q.tipo === 'multipla_escolha' && q.options.length === 0) {
            return toast.warn(`A pergunta ${i + 1} de múltipla escolha precisa de opções.`);
        }
    }
    
    const payload = {
        title,
        description,
        questions: questions.map(q => ({
            categoria: q.categoria?.trim() || null,
            enunciado: q.enunciado,
            tipo: q.tipo,
            options: q.tipo === 'multipla_escolha' ? q.options.map(o => ({
                label: o.label,
                score: Number(o.score) || 0
            })) : [] 
        }))
    };

    try {
        if (templateToEdit) {
            await api.put(`/evaluations/templates/${templateToEdit.id}`, payload);
            toast.success("Questionário atualizado com sucesso!");
        } else {
            await api.post('/evaluations/templates', payload);
            toast.success("Questionário criado com sucesso!");
        }
        
        onSuccess();
        onClose();
    } catch (err) {
        const msg = err.response?.data?.error || "Erro ao salvar questionário";
        toast.error(msg);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <h2>{templateToEdit ? 'Editar Questionário' : 'Novo Modelo de Avaliação'}</h2>
          <Button className="danger-icon" onClick={onClose}><LuX size={24}/></Button>
        </ModalHeader>
        
        <ModalBody>
          <Section>
            <Label>Título do Questionário</Label>
            <Input 
                placeholder="Ex: Escala de Avaliação de Necessidade de Navegação" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                autoFocus
            />
          </Section>

          <Section>
            <Label>Descrição (Opcional)</Label>
            <Textarea 
                rows="2" 
                placeholder="Descreva o objetivo deste questionário..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
          </Section>

          <Section>
            <FormSectionHeader>
               <h3>Estrutura do Formulário</h3>
               <small>{questions.length} item(ns)</small>
            </FormSectionHeader>
            
            {questions.map((q, qIndex) => (
              <QuestionCard 
                key={qIndex} 
                isOrientacao={q.tipo === 'orientacao'}
              >
                <QuestionHeader>
                  <QuestionNumber>{qIndex + 1}</QuestionNumber>
                  
                  <QuestionCategoryWrapper>
                    <Label>Categoria (Opcional)</Label>
                    <Input 
                        value={q.categoria} 
                        onChange={e => updateQuestion(qIndex, 'categoria', e.target.value)}
                        placeholder="Ex: Capacidade de comunicação"
                    />
                  </QuestionCategoryWrapper>

                  <QuestionTypeWrapper>
                    <Label>Tipo do Item</Label>
                    <Select 
                        value={q.tipo} 
                        onChange={e => updateQuestion(qIndex, 'tipo', e.target.value)}
                    >
                        <option value="texto">Texto Livre</option>
                        <option value="multipla_escolha">Múltipla Escolha</option>
                        <option value="orientacao">Orientação / Observação (Sem resposta)</option>
                    </Select>
                  </QuestionTypeWrapper>

                  <QuestionTextWrapper>
                    <Label>
                      {q.tipo === 'orientacao' ? 'Texto da Orientação' : 'Enunciado da Pergunta'}
                    </Label>
                    <Input 
                        value={q.enunciado} 
                        onChange={e => updateQuestion(qIndex, 'enunciado', e.target.value)}
                        placeholder={q.tipo === 'orientacao' ? "Ex: Observar a capacidade de comunicação..." : "Ex: O paciente apresenta náuseas?"}
                    />
                  </QuestionTextWrapper>

                  <DeleteButtonWrapper>
                    <Button 
                        className="danger-icon" 
                        onClick={() => removeQuestion(qIndex)} 
                        title="Remover Item"
                    >
                        <LuTrash2 size={20} />
                    </Button>
                  </DeleteButtonWrapper>
                </QuestionHeader>

                {q.tipo === 'multipla_escolha' && (
                    <OptionsArea>
                        <Label>Critérios / Opções de Resposta</Label>
                        
                        {q.options.map((opt, optIndex) => (
                            <OptionRow key={optIndex}>
                                <div className="input-label">
                                    <Input 
                                        placeholder="Critério (ex: Apresenta alguma dificuldade)" 
                                        value={opt.label}
                                        onChange={e => updateOption(qIndex, optIndex, 'label', e.target.value)}
                                    />
                                </div>
                                <div className="input-score">
                                    <Input 
                                        type="number"
                                        placeholder="Pts" 
                                        title="Pontuação"
                                        value={opt.score}
                                        onChange={e => updateOption(qIndex, optIndex, 'score', e.target.value)}
                                    />
                                </div>
                                <Button 
                                    className="danger-icon" 
                                    onClick={() => removeOption(qIndex, optIndex)}
                                    tabIndex={-1}
                                >
                                    <LuTrash2 size={18} />
                                </Button>
                            </OptionRow>
                        ))}
                        
                        <Button className="add-option" onClick={() => addOption(qIndex)}>
                            <LuPlus /> Adicionar Opção
                        </Button>
                    </OptionsArea>
                )}
              </QuestionCard>
            ))}

            <Button className="add-question" onClick={addQuestion}>
                <LuPlus size={20} /> Adicionar Novo Item
            </Button>
          </Section>

        </ModalBody>

        <ModalFooter>
          <Button className="secondary" onClick={onClose}>Cancelar</Button>
          <Button className="primary" onClick={handleSubmit}>
              {templateToEdit ? 'Salvar Alterações' : 'Salvar Questionário'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default TemplateModal;