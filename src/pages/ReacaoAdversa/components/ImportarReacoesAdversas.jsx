import React, { useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components'; // Adicionado para pegar o tema nos ícones
import { 
  LuCloudUpload, LuFileCheck, LuLoaderCircle, 
  LuCircleCheck, LuInfo, LuPlus 
} from "react-icons/lu";

import * as S from './styles'; 

export default function ImportarReacoesAdversas({ onSuccess }) {
  const theme = useTheme(); // Hook para acessar o tema atual
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
        const response = await api.post('/reacao-adversa/validate', formData);
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
      const res = await api.post('/reacao-adversa/import', formData);
      toast.success(`Sucesso! ${res.data.inseridos} novas reações importadas.`);
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
            <p>O sistema verificará o nome da <strong>Reação Adversa</strong> na planilha e adicionará os não existentes.</p>
            <ul>
                <li>A planilha deve conter uma coluna chamada <strong>"nome"</strong>, <strong>"name"</strong> ou <strong>"Reação"</strong>.</li>
                <li>Pule 1 linha de cabeçalho (se houver linhas de aviso antes do cabeçalho).</li>
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
              <strong>{report.novos.length}</strong> <span>Novos itens</span>
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

          <S.ButtonGroup>
            {/* Removido o style inline hardcoded e adicionado variant */}
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