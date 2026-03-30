import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { 
    LuCloudUpload, 
    LuFileCheck, 
    LuLoaderCircle,      
    LuTriangleAlert, 
    LuCircleCheck,   
    LuCircleX,
    LuInfo,
    LuDownload
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
  
  // Estado para a barra de progresso
  const [progress, setProgress] = useState(0); 

  useEffect(() => {
    async function loadOperadoras() {
      try {
        const response = await api.get('/operadoras/filtro');
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
    if (!validationResult?.detalhes?.validos || !operadoraId) return;
    
    setStep(4);
    setProgress(0);

    const pacientesValidos = validationResult.detalhes.validos;
    const total = pacientesValidos.length;
    const chunkSize = 50; // Envia de 50 em 50
    
    let allSuccesses = [];
    let allErrors = [];
    let importadosAteAgora = 0;

    for (let i = 0; i < total; i += chunkSize) {
        const chunk = pacientesValidos.slice(i, i + chunkSize);
        
        try {
            const response = await api.post('/pacientes/import-batch', {
                operadora_id: operadoraId,
                pacientes: chunk
            });
            
            allSuccesses.push(...response.data.successes);
            allErrors.push(...response.data.errors);
        } catch (err) {
            toast.error(`Erro ao processar o lote ${Math.floor(i / chunkSize) + 1}. Importação parcialmente interrompida.`);
            break; 
        }

        importadosAteAgora += chunk.length;
        const calcProgress = Math.round((importadosAteAgora / total) * 100);
        setProgress(calcProgress > 100 ? 100 : calcProgress);
    }

    setFinalResult({ 
        summary: {
            importados: allSuccesses.length,
            erros: allErrors.length
        },
        detalhes: {
            erros: allErrors
        }
    });

    setStep(5); 
    toast.success("Processamento em lotes finalizado!");
    if(onSuccess) onSuccess();
  };

  const handleDownloadLogs = () => {
      if (!finalResult || finalResult.summary.erros === 0) return;

      let conteudo = "RELATÓRIO DE ERROS DE IMPORTAÇÃO (BANCO DE DADOS)\n";
      conteudo += "=================================================\n\n";

      finalResult.detalhes.erros.forEach((err, index) => {
          conteudo += `Erro #${index + 1}\n`;
          conteudo += `Paciente: ${err.nome}\n`;
          conteudo += `CPF: ${err.cpf}\n`;
          conteudo += `Motivo: ${err.erro}\n`;
          conteudo += `-------------------------------------------------\n\n`;
      });

      const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `erros_importacao_bd_${new Date().getTime()}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setStep(1);
    setValidationResult(null);
    setFinalResult(null);
    setProgress(0);
  };

  return (
    <S.ImportContainer>
      
      {/* --- PASSO 1: SELEÇÃO --- */}
      {step === 1 && (
        <>
            <S.InstructionsBox>
                <h4><LuInfo size={22} /> Padrão da Planilha</h4>
                <p>Para o envio ser bem-sucedido, a primeira linha da sua planilha deve conter os cabeçalhos <strong>exatamente</strong> com os nomes abaixo:</p>
                <ul>
                    <li><span className="mandatory">cpf</span> ou <span className="mandatory">CPF</span> (Obrigatório)</li>
                    <li><span className="mandatory">nome</span> ou <span className="mandatory">Nome</span> (Obrigatório)</li>
                    <li><strong>sobrenome</strong> ou Sobrenome</li>
                    <li><strong>celular</strong> ou Celular</li>
                    <li><strong>telefone</strong> ou Telefone</li>
                    <li><strong>data_nascimento</strong></li>
                    <li><strong>sexo</strong> ou Sexo</li>
                    <li><strong>cep</strong> ou CEP</li>
                    <li><strong>logradouro</strong> ou Logradouro</li>
                    <li><strong>numero</strong> ou Numero</li>
                    <li><strong>complemento</strong> ou Complemento</li>
                    <li><strong>bairro</strong> ou Bairro</li>
                    <li><strong>cidade</strong> ou Cidade</li>
                    <li><strong>estado</strong> ou Estado</li>
                    <li><strong>possui_cuidador</strong> (Sim/Não)</li>
                    <li><strong>nome_cuidador</strong></li>
                    <li><strong>contato_cuidador</strong></li>
                </ul>
            </S.InstructionsBox>

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
        </>
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

            {/* AVISO DE PARCIALIDADE SE TIVER DUPLICADO/INVÁLIDO */}
            {(validationResult.resumo.duplicados > 0 || validationResult.resumo.invalidos > 0) && (
                <div style={{ padding: '15px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '6px', color: '#d46b08', marginBottom: '15px' }}>
                    <strong>⚠️ Atenção:</strong> Foram encontrados problemas em algumas linhas da planilha. Apenas os <strong>{validationResult.resumo.validos}</strong> pacientes corretos serão importados. Você pode prosseguir e corrigir os demais depois.
                </div>
            )}

            <h4>Logs de Validação:</h4>
            <S.LogContainer>
                {validationResult.detalhes.duplicados.map((item, idx) => (
                    <S.LogItem key={`dup-${idx}`} className="warning">
                        <LuTriangleAlert size={16} />
                        <span><strong>Linha {item.linha}: {item.nome}</strong> (CPF: {item.cpf})<br/>Motivo: {item.motivo}</span>
                    </S.LogItem>
                ))}

                {validationResult.detalhes.invalidos.map((item, idx) => (
                    <S.LogItem key={`inv-${idx}`} className="error">
                        <LuCircleX size={16} />
                        <span><strong>Linha {item.linha}:</strong> {item.motivo} {item.cpf ? `(CPF: ${item.cpf})` : ''}</span>
                    </S.LogItem>
                ))}

                {validationResult.detalhes.validos.length > 0 && (
                    <S.LogItem className="success">
                        <LuCircleCheck size={16} />
                        <span>{validationResult.detalhes.validos.length} pacientes prontos para importação. Nenhum conflito detectado nestes registros.</span>
                    </S.LogItem>
                )}
            </S.LogContainer>

            <S.ButtonGroup style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <S.Button variant="secondary" onClick={reset}>Cancelar / Escolher outra</S.Button>
                <S.Button 
                    onClick={handleFinalImport} 
                    disabled={validationResult.resumo.validos === 0}
                    style={{ flex: 2 }}
                >
                    Confirmar Importação de {validationResult.resumo.validos} pacientes
                </S.Button>
            </S.ButtonGroup>
        </div>
      )}

      {/* --- PASSO 4: LOADER COM BARRA DE PROGRESSO REAL --- */}
      {step === 4 && (
        <S.StatusBox style={{ textAlign: 'center', padding: '40px 20px' }}>
            <S.Spinner><LuLoaderCircle size={40} /></S.Spinner>
            <h3 style={{ marginTop: '20px' }}>Importando pacientes...</h3>
            
            {/* Barra de Progresso visual */}
            <div style={{ width: '100%', backgroundColor: '#e0e0df', borderRadius: '8px', marginTop: '15px', overflow: 'hidden' }}>
                <div style={{ 
                    height: '24px', 
                    width: `${progress}%`, 
                    backgroundColor: '#1677ff', 
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                }}>
                    {progress}%
                </div>
            </div>
            <span style={{ display: 'block', marginTop: '10px', color: '#666' }}>
                Enviando lotes para o banco de dados. Por favor, aguarde.
            </span>
        </S.StatusBox>
      )}

      {/* --- PASSO 5: RELATÓRIO FINAL COM ERROS DE BANCO E DOWNLOAD TXT --- */}
      {step === 5 && finalResult && (
        <div style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ textAlign: 'center' }}>
                <LuCircleCheck size={60} color={finalResult.summary.erros > 0 ? "#faad14" : "#52c41a"} style={{ marginBottom: '20px' }} />
                <h3>Processo Finalizado!</h3>
                <p>Foram importados com sucesso <strong>{finalResult.summary.importados}</strong> novos pacientes.</p>
            </div>
            
            {/* SE O BANCO REJEITAR ALGUM DADO */}
            {finalResult.summary.erros > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ color: '#cf1322', margin: 0 }}>Falhas na Gravação ({finalResult.summary.erros}):</h4>
                        <S.Button onClick={handleDownloadLogs} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '14px' }}>
                            <LuDownload size={16} /> Baixar Logs (.txt)
                        </S.Button>
                    </div>
                    
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Estes pacientes passaram na validação da planilha, mas o banco de dados recusou na hora de salvar (ex: tamanho de campo, formato inesperado).</p>
                    
                    <S.LogContainer style={{ maxHeight: '250px', overflowY: 'auto' }}>
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