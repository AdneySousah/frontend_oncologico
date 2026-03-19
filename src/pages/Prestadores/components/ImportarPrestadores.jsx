import React, { useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';
import { LuCloudUpload, LuFileCheck, LuLoaderCircle, LuCircleCheck, LuInfo, LuPlus } from "react-icons/lu";
import * as S from '../styles'; 

export default function ImportarPrestadores({ onSuccess }) {
  const theme = useTheme(); 
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
        const response = await api.post('/prestadores-medicos/validate', formData);
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
      const res = await api.post('/prestadores-medicos/import', formData);
      toast.success(`Sucesso! ${res.data.inseridos} novos prestadores importados.`);
      setStep(5);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Erro na importação final.");
      setStep(3);
    }
  };

  return (
    <S.ImportContainer>
      {step === 1 && (
        <>
          <S.InstructionsBox>
            <h4><LuInfo size={22} /> Revisão de Carga</h4>
            <p>O sistema identificará novos <strong>Prestadores</strong> pelo <strong>Nome</strong> ou <strong>Razão Social</strong>.</p>
            <ul>
                <li>Colunas suportadas: <strong>nome, cnpj, tipo, cep, logradouro, numero, bairro, cidade, estado</strong>.</li>
                <li>Caso endereço não seja enviado na planilha, será salvo como "Não informado".</li>
            </ul>
          </S.InstructionsBox>
          <S.UploadBox>
            <LuCloudUpload size={48} color={theme?.colors?.border || "#555"} />
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
              <strong>{report.novos.length}</strong> <span>Novos registros</span>
            </S.SummaryCard>
            <S.SummaryCard>
              <strong>{report.identicos.length}</strong> <span>Itens já existentes</span>
            </S.SummaryCard>
          </S.SummaryGrid>

          <S.LogContainer>
            {report.novos.map((r, i) => (
              <S.LogItem key={i} className="success">
                <LuPlus size={14} /> [NOVO] {r.name} 
              </S.LogItem>
            ))}
          </S.LogContainer>

          <S.ButtonGroup style={{ border: 'none', paddingTop: 0 }}>
            <S.Button onClick={() => setStep(1)} variant="secondary">Voltar</S.Button>
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
          <LuCircleCheck size={60} color={theme?.colors?.success || "#52c41a"} />
          <h2>Base Atualizada!</h2>
          <S.Button onClick={() => setStep(1)} style={{ marginTop: '20px' }}>Fazer novo upload</S.Button>
        </div>
      )}
    </S.ImportContainer>
  );
}