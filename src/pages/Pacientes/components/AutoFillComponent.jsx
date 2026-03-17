import React, { useState, useRef } from 'react';
import api from '../../../services/api'; // Ajuste o caminho conforme sua estrutura
import { toast } from 'react-toastify';
import { 
  Button, ModalOverlay, ModalContent, ModalActions,
  AutoFillContainer, AutoFillText, ResultBox
} from '../styles'; // Ajuste o caminho dos estilos

export default function AutoFillComponent({ onFillData }) {
  const [isAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [autoFillModalOpen, setAutoFillModalOpen] = useState(false);
  const [autoFillResult, setAutoFillResult] = useState(null);
  const [pendingDocFile, setPendingDocFile] = useState(null);
  
  const fileInputRef = useRef(null); 

  const camposMapeados = {
    nomeCompleto: "Nome Completo", cpf: "CPF", data_nascimento: "Data Nasc.",
    sexo: "Sexo", celular: "Celular", telefone: "Telefone", cep: "CEP",
    logradouro: "Logradouro", numero: "Número", complemento: "Complemento",
    bairro: "Bairro", cidade: "Cidade", estado: "Estado", possui_cuidador: "Possui Cuidador",
    nome_cuidador: "Nome Cuidador", contato_cuidador: "Contato Cuidador"
  };

  const handleAutoFillUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'image/jpeg', 'image/png', 'image/webp', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, envie uma Imagem, PDF ou documento Word.");
      return;
    }

    setPendingDocFile(file);
    const dataToSend = new FormData();
    dataToSend.append('documento', file);

    setIsAutoFillLoading(true);
    
    try {
      const response = await api.post('/pacientes/autofill', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAutoFillResult(response.data);
      setAutoFillModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao processar o documento com IA.");
    } finally {
      setIsAutoFillLoading(false);
      e.target.value = null; // Reseta o input
    }
  };

  const triggerAutoFillUpload = () => fileInputRef.current.click();

  const confirmFill = () => {
    // Repassa os dados para o componente pai e fecha o modal
    onFillData(autoFillResult, pendingDocFile);
    setAutoFillModalOpen(false);
    setAutoFillResult(null);
    setPendingDocFile(null);
  };

  const renderModal = () => {
    if (!autoFillResult) return null;
    
    // Ignoramos completamente os dados de medicamento vindos da IA
    const excludedKeys = ['medicamento_extraido', 'medicamentos_sugeridos'];
    
    const encontrados = Object.keys(autoFillResult).filter(k => 
      !excludedKeys.includes(k) && 
      autoFillResult[k] !== '' && 
      autoFillResult[k] !== null && 
      autoFillResult[k] !== false
    );
    const naoEncontrados = Object.keys(camposMapeados).filter(k => !encontrados.includes(k));

    return (
      <ModalOverlay style={{ zIndex: 1000 }}>
        <ModalContent style={{ width: '550px', maxHeight: '85vh', overflowY: 'auto' }}>
          <h3 style={{ color: '#007bff', marginBottom: '15px' }}>🚀 Análise de Documento Concluída</h3>
          
          <p style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', fontSize: '14px', marginBottom: '15px' }}>
            <strong>Atenção:</strong> A seleção do medicamento deve ser feita <strong>manualmente</strong> no formulário para garantir a dosagem correta.
          </p>

          <ResultBox className="success">
            <h4>✅ Dados Encontrados:</h4>
            <ul>
              {encontrados.length > 0 ? encontrados.map(k => (
                <li key={k}><strong>{camposMapeados[k]}:</strong> {String(autoFillResult[k])}</li>
              )) : <li>Nenhum dado extra legível encontrado.</li>}
            </ul>
          </ResultBox>

          <ResultBox className="warning">
            <h4>⚠️ Requer Preenchimento Manual:</h4>
            <ul>
              {naoEncontrados.length > 0 ? naoEncontrados.map(k => (
                <li key={k}>{camposMapeados[k]}</li>
              )) : <li>Todos os campos base foram encontrados!</li>}
            </ul>
          </ResultBox>

          <ModalActions style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
            <Button type="button" onClick={() => setAutoFillModalOpen(false)} color="#6c757d">Cancelar</Button>
            <Button type="button" onClick={confirmFill} color="#28a745">Confirmar e Preencher</Button>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    );
  };

  return (
    <>
      <AutoFillContainer>
        <AutoFillText>
          <h4>Preenchimento Inteligente</h4>
          <p>Envie um documento para preencher os dados automaticamente.</p>
        </AutoFillText>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/jpeg, image/png, image/webp, application/pdf, .doc, .docx" 
          onChange={handleAutoFillUpload} 
        />
        <Button type="button" onClick={triggerAutoFillUpload} disabled={isAutoFillLoading}>
          {isAutoFillLoading ? '⏳ Lendo documento...' : '📄 Enviar Doc. de Auto Preenchimento'}
        </Button>
      </AutoFillContainer>

      {autoFillModalOpen && renderModal()}
    </>
  );
}