import React, { useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { 
    LuCloudUpload, 
    LuFileCheck, 
    LuLoaderCircle,      
    LuTriangleAlert, 
    LuCircleCheck,   
    LuCircleX        
} from "react-icons/lu";

import * as S from './styles'; // Importando todos os estilos como 'S'

export default function ImportarPacientes({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1); 
  const [validationResult, setValidationResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      validateFileOnServer(selected); 
    }
  };

  const validateFileOnServer = async (arquivo) => {
    setStep(2); 
    const formData = new FormData();
    formData.append('file', arquivo);

    try {
      const response = await api.post('/pacientes/validate', formData);
      setValidationResult(response.data);
      setStep(3); 
    } catch (err) {
      toast.error("Erro ao validar arquivo.");
      setStep(1);
      setFile(null);
    }
  };

  const handleFinalImport = async () => {
    if (!file) return;
    setStep(4); 

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/pacientes/import', formData);
      setFinalResult(response.data);
      setStep(5); 
      toast.success("Importação finalizada!");
      if(onSuccess) onSuccess();
    } catch (err) {
      toast.error("Erro ao importar dados.");
      setStep(3); 
    }
  };

  const reset = () => {
    setFile(null);
    setStep(1);
    setValidationResult(null);
    setFinalResult(null);
  };

  return (
    <S.ImportContainer>
      
      {/* --- PASSO 1: SELEÇÃO --- */}
      {step === 1 && (
        <S.UploadBox>
            <LuCloudUpload size={48} color="#ccc" />
            <p>Clique para selecionar a planilha (.xlsx)</p>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
        </S.UploadBox>
      )}

      {/* --- PASSO 2: LOADER DE VALIDAÇÃO --- */}
      {step === 2 && (
        <S.StatusBox>
            <S.Spinner><LuLoaderCircle size={24} /></S.Spinner>
            <span>Validando dados com o banco de dados...</span>
        </S.StatusBox>
      )}

      {/* --- PASSO 3: REVISÃO DOS DADOS --- */}
      {step === 3 && validationResult && (
        <div style={{ textAlign: 'left' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px' }}>
                <LuFileCheck size={28} color="#52c41a" />
                <h3 style={{ margin: 0 }}>Análise do Arquivo</h3>
            </div>

            <S.SummaryGrid>
                <S.SummaryCard className="success">
                    <strong>{validationResult.resumo.validos}</strong>
                    <span>Novos Pacientes</span>
                </S.SummaryCard>
                <S.SummaryCard className="warning">
                    <strong>{validationResult.resumo.duplicados}</strong>
                    <span>Já Cadastrados</span>
                </S.SummaryCard>
                <S.SummaryCard className="error">
                    <strong>{validationResult.resumo.invalidos}</strong>
                    <span>Inválidos</span>
                </S.SummaryCard>
            </S.SummaryGrid>

            <h4>Logs de Validação:</h4>
            <S.LogContainer>
                {validationResult.detalhes.duplicados.map((item, idx) => (
                    <S.LogItem key={`dup-${idx}`} className="warning">
                        <LuTriangleAlert size={16} />
                        <span><strong>{item.nome}</strong> (CPF: {item.cpf}) - {item.motivo}</span>
                    </S.LogItem>
                ))}

                {validationResult.detalhes.invalidos.map((item, idx) => (
                    <S.LogItem key={`inv-${idx}`} className="error">
                        <LuCircleX size={16} />
                        <span>Linha inválida: {item.motivo}</span>
                    </S.LogItem>
                ))}

                {validationResult.detalhes.validos.length > 0 && (
                    <S.LogItem className="success">
                        <LuCircleCheck size={16} />
                        <span>{validationResult.detalhes.validos.length} pacientes prontos para importação.</span>
                    </S.LogItem>
                )}
            </S.LogContainer>

            <S.ButtonGroup>
                <S.Button variant="secondary" onClick={reset}>Cancelar</S.Button>
                <S.Button 
                    onClick={handleFinalImport} 
                    disabled={validationResult.resumo.validos === 0}
                    style={{ flex: 2 }}
                >
                    {validationResult.resumo.validos > 0 
                        ? `Confirmar Importação (${validationResult.resumo.validos})` 
                        : 'Nada para importar'}
                </S.Button>
            </S.ButtonGroup>
        </div>
      )}

      {/* --- PASSO 4: LOADER DE GRAVAÇÃO --- */}
      {step === 4 && (
        <S.StatusBox>
            <S.Spinner><LuLoaderCircle size={24} /></S.Spinner>
            <span>Gravando dados no sistema... Aguarde.</span>
        </S.StatusBox>
      )}

      {/* --- PASSO 5: RELATÓRIO FINAL --- */}
      {step === 5 && finalResult && (
        <div style={{ padding: '20px' }}>
            <LuCircleCheck size={60} color="#52c41a" style={{ marginBottom: '20px' }} />
            <h3>Processo Finalizado!</h3>
            <p>Foram importados <strong>{finalResult.summary.importados}</strong> novos pacientes.</p>
            <S.Button onClick={reset} style={{ marginTop: '20px', width: '100%' }}>Nova Importação</S.Button>
        </div>
      )}

    </S.ImportContainer>
  );
}