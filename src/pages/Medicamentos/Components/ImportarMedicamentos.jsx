import React, { useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { 
    LuCloudUpload, LuFileCheck, LuLoaderCircle, 
    LuCircleCheck, LuCircleX, LuInfo, 
    LuTriangleAlert, LuPlus 
} from "react-icons/lu";
import * as S from '../styles';

export default function ImportarMedicamentos({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1); 
  const [report, setReport] = useState(null);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setStep(2);
      
      const formData = new FormData();
      formData.append('file', selected);

      try {
        const response = await api.post('/medicamentos/validate', formData);
        setReport(response.data);
        setStep(3);
      } catch (err) {
        toast.error("Erro ao validar planilha.");
        setStep(1);
        setFile(null);
      }
    }
  };

  const handleConfirmImport = async () => {
    setStep(4);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/medicamentos/import', formData);
      toast.success(`Sucesso! ${res.data.inseridos} novos e ${res.data.atualizados} atualizados.`);
      setStep(5);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Erro na importação final.");
      setStep(3);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <S.ImportContainer>
      {step === 1 && (
        <>
          <S.InstructionsBox>
            <h4><LuInfo size={22} /> Revisão de Carga</h4>
            <p>O sistema comparará o <strong>Código TUSS</strong> da planilha com o banco de dados.</p>
          </S.InstructionsBox>
          <S.UploadBox>
            <LuCloudUpload size={48} color="#ccc" />
            <p>Selecione a planilha .xlsx para validar</p>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
          </S.UploadBox>
        </>
      )}

      {step === 2 && (
        <S.StatusBox>
          <S.Spinner><LuLoaderCircle size={30} /></S.Spinner>
          <span>Cruzando dados da planilha com o banco...</span>
        </S.StatusBox>
      )}

      {step === 3 && report && (
        <div style={{ textAlign: 'left' }}>
          <h3><LuFileCheck /> Relatório de Pré-Importação</h3>
          
          <S.SummaryGrid>
            <S.SummaryCard className="success">
              <strong>{report.novos.length}</strong> <span>Novos itens</span>
            </S.SummaryCard>
            <S.SummaryCard className="warning">
              <strong>{report.atualizacoes.length}</strong> <span>Alterações de Preço</span>
            </S.SummaryCard>
            <S.SummaryCard>
              <strong>{report.identicos.length}</strong> <span>Sem alterações</span>
            </S.SummaryCard>
          </S.SummaryGrid>

          <S.LogContainer>
            {report.novos.map((m, i) => (
              <S.LogItem key={i} className="success">
                <LuPlus size={14} /> [NOVO] {m.nome} (TUSS: {m.codigo_tuss || 'N/A'}) - {formatCurrency(m.preco)}
              </S.LogItem>
            ))}
            {report.atualizacoes.map((m, i) => (
              <S.LogItem key={i} className="warning">
                <LuTriangleAlert size={14} /> [PREÇO] {m.nome}
                <br/> <small>De: {formatCurrency(m.precoAntigo)} para: <strong>{formatCurrency(m.precoNovo)}</strong></small>
              </S.LogItem>
            ))}
          </S.LogContainer>

          <S.ButtonGroup>
            <S.Button onClick={() => setStep(1)} style={{ background: '#eee', color: '#333' }}>Voltar</S.Button>
            <S.Button onClick={handleConfirmImport} style={{ flex: 2 }}>Confirmar e Salvar no Banco</S.Button>
          </S.ButtonGroup>
        </div>
      )}

      {step === 4 && (
        <S.StatusBox>
          <S.Spinner><LuLoaderCircle size={30} /></S.Spinner>
          <span>Efetuando as alterações...</span>
        </S.StatusBox>
      )}

      {step === 5 && (
        <div style={{ textAlign: 'center' }}>
          <LuCircleCheck size={60} color="#52c41a" />
          <h2>Base Atualizada!</h2>
          <S.Button onClick={() => setStep(1)} style={{ marginTop: '20px' }}>Fazer novo upload</S.Button>
        </div>
      )}
    </S.ImportContainer>
  );
}