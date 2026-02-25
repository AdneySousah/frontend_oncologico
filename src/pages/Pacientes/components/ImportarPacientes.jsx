import React, { useState, useEffect } from 'react';
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

import * as S from './styles'; 

export default function ImportarPacientes({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1); 
  const [validationResult, setValidationResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  
  const [operadoras, setOperadoras] = useState([]);
  const [operadoraId, setOperadoraId] = useState('');
  const [loadingOps, setLoadingOps] = useState(true);

  useEffect(() => {
    async function loadOperadoras() {
      try {
        const response = await api.get('/pacientes/operadoras-filtro'); 
        setOperadoras(response.data);
        if (response.data.length === 1) {
            setOperadoraId(response.data[0].id);
        }
      } catch (err) {
        toast.error("Erro ao carregar operadoras");
      } finally {
        setLoadingOps(false);
      }
    }
    loadOperadoras();
  }, []);

  const handleFileChange = (e) => {
    if (!operadoraId) {
        toast.warning("Selecione uma operadora antes de enviar o arquivo.");
        e.target.value = null; 
        return;
    }

    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      validateFileOnServer(selected); 
    }
  };

  const validateFileOnServer = async (arquivo) => {
    setStep(2); 
    const formData = new FormData();
    formData.append('operadora_id', operadoraId);
    formData.append('file', arquivo);

    try {
      const response = await api.post('/pacientes/validate', formData);
      setValidationResult(response.data);
      setStep(3); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao validar arquivo.");
      setStep(1);
      setFile(null);
    }
  };

  const handleFinalImport = async () => {
    if (!file || !operadoraId) return;
    setStep(4); 

    const formData = new FormData();
    formData.append('operadora_id', operadoraId);
    formData.append('file', file);

    try {
      const response = await api.post('/pacientes/import', formData);
      setFinalResult(response.data);
      setStep(5); 
      toast.success("Processamento finalizado!");
      if(onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao importar dados.");
      setStep(3); 
    }
  };

  const reset = () => {
    setFile(null);
    setStep(1);
    setValidationResult(null);
    setFinalResult(null);
    // document.getElementById('file-upload').value = null; // caso seja necessário resetar o input
  };

  return (
    <S.ImportContainer>
      
      {/* --- PASSO 1: SELEÇÃO --- */}
      {step === 1 && (
        <S.UploadBox>
            <S.SelectGroup>
                <label>Vincular pacientes à Operadora:</label>
                <S.Select 
                    value={operadoraId} 
                    onChange={(e) => setOperadoraId(e.target.value)}
                    disabled={loadingOps || operadoras.length === 1}
                >
                    <option value="">Selecione uma operadora...</option>
                    {operadoras.map(op => (
                        <option key={op.id} value={op.id}>
                            {op.nome}
                        </option>
                    ))}
                </S.Select>
            </S.SelectGroup>

            <LuCloudUpload size={48} color="#ccc" />
            <p>Clique para selecionar a planilha (.xlsx ou .csv)</p>
            <input 
                id="file-upload"
                type="file" 
                accept=".xlsx, .csv" 
                onChange={handleFileChange} 
                disabled={!operadoraId}
            />
        </S.UploadBox>
      )}

      {/* --- PASSO 2: LOADER DE VALIDAÇÃO --- */}
      {step === 2 && (
        <S.StatusBox>
            <S.Spinner><LuLoaderCircle size={24} /></S.Spinner>
            <span>Analisando planilha e validando CPFs com o banco de dados...</span>
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
                    <span>Prontos p/ Importar</span>
                </S.SummaryCard>
                <S.SummaryCard className="warning">
                    <strong>{validationResult.resumo.duplicados}</strong>
                    <span>CPFs Duplicados</span>
                </S.SummaryCard>
                <S.SummaryCard className="error">
                    <strong>{validationResult.resumo.invalidos}</strong>
                    <span>Com Erros</span>
                </S.SummaryCard>
            </S.SummaryGrid>

            {/* AVISO DE BLOQUEIO DE IMPORTAÇÃO SE TIVER DUPLICADO/INVÁLIDO */}
            {(validationResult.resumo.duplicados > 0 || validationResult.resumo.invalidos > 0) && (
                <div style={{ padding: '15px', background: '#fff1f0', border: '1px solid #cf1322', borderRadius: '6px', color: '#cf1322', marginBottom: '15px' }}>
                    <strong>⚠️ Importação Bloqueada:</strong> Foram encontrados CPFs que já pertencem a outros usuários no sistema ou linhas vazias. Verifique o relatório abaixo, corrija a planilha e tente novamente.
                </div>
            )}

            <h4>Logs de Validação:</h4>
            <S.LogContainer>
                {validationResult.detalhes.duplicados.map((item, idx) => (
                    <S.LogItem key={`dup-${idx}`} className="warning">
                        <LuTriangleAlert size={16} />
                        <span><strong>Planilha: {item.nome}</strong> (CPF: {item.cpf})<br/>Motivo: {item.motivo}</span>
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
                        <span>{validationResult.detalhes.validos.length} pacientes prontos para importação. Nenhum conflito de CPF detectado.</span>
                    </S.LogItem>
                )}
            </S.LogContainer>

            <S.ButtonGroup>
                <S.Button variant="secondary" onClick={reset}>Cancelar / Corrigir Planilha</S.Button>
                <S.Button 
                    onClick={handleFinalImport} 
                    // MUDANÇA: TRAVA 100% o botão se tiver 1 duplicado, 1 invalido ou 0 validos
                    disabled={
                        validationResult.resumo.duplicados > 0 || 
                        validationResult.resumo.invalidos > 0 || 
                        validationResult.resumo.validos === 0
                    }
                    style={{ flex: 2 }}
                >
                    Confirmar Importação
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

      {/* --- PASSO 5: RELATÓRIO FINAL COM ERROS DE BANCO DE DADOS --- */}
      {step === 5 && finalResult && (
        <div style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ textAlign: 'center' }}>
                <LuCircleCheck size={60} color={finalResult.summary.erros > 0 ? "#faad14" : "#52c41a"} style={{ marginBottom: '20px' }} />
                <h3>Processo Finalizado!</h3>
                <p>Foram importados com sucesso <strong>{finalResult.summary.importados}</strong> novos pacientes.</p>
            </div>
            
            {/* SE O BANCO REJEITAR ALGUM DADO, APARECERÁ AQUI */}
            {finalResult.summary.erros > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color: '#cf1322' }}>Atenção: Falhas na Gravação ({finalResult.summary.erros}):</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Estes pacientes passaram na validação do CPF, mas foram rejeitados internamente pelo banco de dados na hora de salvar (ex: campos fora do padrão, banco fora do ar).</p>
                    <S.LogContainer>
                        {finalResult.detalhes.erros.map((err, idx) => (
                            <S.LogItem key={`err-db-${idx}`} className="error">
                                <LuCircleX size={16} />
                                <span><strong>{err.nome}</strong> (CPF: {err.cpf})<br/><small>Erro do banco: {err.erro}</small></span>
                            </S.LogItem>
                        ))}
                    </S.LogContainer>
                </div>
            )}

            <S.Button onClick={reset} style={{ marginTop: '20px', width: '100%' }}>Fazer Nova Importação</S.Button>
        </div>
      )}

    </S.ImportContainer>
  );
}