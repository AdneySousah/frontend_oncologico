import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Overlay, ModalContainer, ModalHeader, ModalBody, ModalFooter, 
  Section, QuestionCard, QuestionHeader, QuestionNumber, OptionsArea, OptionRow, 
  Button, Select, Input, Label, Textarea 
} from './styles';
import { LuTrash2, LuPlus, LuX } from "react-icons/lu";
import api from '../../../services/api';

const TemplateModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [questions, setQuestions] = useState([
    { enunciado: '', tipo: 'texto', options: [] } 
  ]);

  if (!isOpen) return null;

  // --- Funções de Manipulação (Mantidas iguais) ---
  const addQuestion = () => {
    setQuestions([...questions, { enunciado: '', tipo: 'texto', options: [] }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    
    if (field === 'tipo' && value === 'texto') {
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
    // ... (Mesma validação e lógica de submit do código anterior) ...
    // Vou resumir para focar no layout, mas mantenha a lógica original aqui
    if (!title.trim()) return toast.warn("Dê um título ao questionário.");
    
    const payload = {
        title,
        description,
        questions: questions.map(q => ({
            enunciado: q.enunciado,
            tipo: q.tipo,
            options: q.tipo === 'multipla_escolha' ? q.options.map(o => ({
                label: o.label,
                score: Number(o.score)
            })) : [] 
        }))
    };

    try {
        await api.post('/evaluations/templates', payload);
        toast.success("Questionário criado com sucesso!");
        onSuccess();
        onClose();
        setTitle('');
        setDescription('');
        setQuestions([{ enunciado: '', tipo: 'texto', options: [] }]);
    } catch (err) {
        const msg = err.response?.data?.error || "Erro ao salvar";
        toast.error(msg);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <h2>Novo Modelo de Avaliação</h2>
          <Button className="danger-icon" onClick={onClose}><LuX size={24}/></Button>
        </ModalHeader>
        
        <ModalBody>
          {/* Dados do Cabeçalho */}
          <Section>
            <Label>Título do Questionário</Label>
            <Input 
                placeholder="Ex: Anamnese Oncológica Padrão" 
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

          <div style={{ marginTop: '2rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
               <h3 style={{ color: '#555' }}>Perguntas do Formulário</h3>
               <small style={{ color: '#888' }}>{questions.length} pergunta(s)</small>
            </div>
            
            {questions.map((q, qIndex) => (
              <QuestionCard key={qIndex}>
                {/* Header da Pergunta: Grid System */}
                <QuestionHeader>
                  <QuestionNumber>{qIndex + 1}</QuestionNumber>
                  
                  <div style={{ width: '100%' }}>
                    <Label style={{ marginBottom: '4px' }}>Enunciado</Label>
                    <Input 
                        value={q.enunciado} 
                        onChange={e => updateQuestion(qIndex, 'enunciado', e.target.value)}
                        placeholder="Ex: O paciente apresenta náuseas?"
                    />
                  </div>

                  <div>
                    <Label style={{ marginBottom: '4px' }}>Tipo de Resposta</Label>
                    <Select 
                        value={q.tipo} 
                        onChange={e => updateQuestion(qIndex, 'tipo', e.target.value)}
                    >
                        <option value="texto">Texto Livre</option>
                        <option value="multipla_escolha">Múltipla Escolha</option>
                    </Select>
                  </div>

                  <div style={{ marginTop: '22px' }}>
                    <Button 
                        className="danger-icon" 
                        onClick={() => removeQuestion(qIndex)} 
                        title="Remover Pergunta"
                    >
                        <LuTrash2 size={20} />
                    </Button>
                  </div>
                </QuestionHeader>

                {/* Área de Opções (Condicional e Destacada) */}
                {q.tipo === 'multipla_escolha' && (
                    <OptionsArea>
                        <Label style={{ marginBottom: '10px' }}>Opções Selecionáveis</Label>
                        
                        {q.options.map((opt, optIndex) => (
                            <OptionRow key={optIndex}>
                                <div className="input-label">
                                    <Input 
                                        placeholder="Texto da opção (ex: Sim, Frequente)" 
                                        value={opt.label}
                                        onChange={e => updateOption(qIndex, optIndex, 'label', e.target.value)}
                                    />
                                </div>
                                <div className="input-score">
                                    <Input 
                                        type="number"
                                        placeholder="Pts" 
                                        title="Pontuação para Score de Risco"
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
                            <LuPlus /> Adicionar Opção de Resposta
                        </Button>
                    </OptionsArea>
                )}
              </QuestionCard>
            ))}

            <Button className="add-question" onClick={addQuestion}>
                <LuPlus size={20} /> Adicionar Nova Pergunta
            </Button>
          </div>

        </ModalBody>

        <ModalFooter>
          <Button className="secondary" onClick={onClose}>Cancelar</Button>
          <Button className="primary" onClick={handleSubmit}>Salvar Questionário</Button>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default TemplateModal;