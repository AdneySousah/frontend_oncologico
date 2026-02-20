import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Importação no Front para checagem rápida
import api from '../../services/api'; // Seu axios configurado
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Estilos Simples
const Container = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 8px;
`;

const UploadBox = styled.div`
  border: 2px dashed #ccc;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover { border-color: #007bff; background: #f9f9f9; }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #0052cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

export default function ImportarPacientes({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [isValidHeaders, setIsValidHeaders] = useState(false);
  const [step, setStep] = useState(1); // 1: Seleção, 2: Confirmação, 3: Resultado
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Colunas esperadas (exatamente como devem estar no Excel)
  const EXPECTED_HEADERS = [
    'nome', 'sobrenome', 'celular', 'telefone', 'data_nascimento', 
    'sexo', 'possui_cuidador', 'nome_cuidador', 'contato_cuidador', 
    'cep', 'numero', 'complemento', 'operadora_id', 'cpf'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      checkColumns(selectedFile);
    }
  };

  // 1. Checagem de Colunas no Front (Sem enviar pro back ainda)
  const checkColumns = (arquivo) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      // Pega a primeira linha como JSON
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = data[0]; // Array de strings com os nomes das colunas

      // Verifica se todas as colunas esperadas existem
      // (Pode ajustar para ser Case Insensitive se quiser)
      const missing = EXPECTED_HEADERS.filter(h => !headers.includes(h));

      if (missing.length > 0) {
        toast.error(`Colunas divergentes! Faltando: ${missing.join(', ')}`);
        setFile(null);
        setIsValidHeaders(false);
      } else {
        toast.success("Estrutura do arquivo correta!");
        setFile(arquivo);
        setIsValidHeaders(true);
        setStep(2); // Vai para etapa de confirmação
      }
    };
    reader.readAsBinaryString(arquivo);
  };

  // 2. Envio pro Backend
  const handleImport = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await api.post('/pacientes/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setReport(response.data);
      setStep(3); // Mostra resultado
      toast.success("Importação finalizada!");
      if(onSuccess) onSuccess(); // Recarrega a lista se necessário

    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar arquivo para o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setIsValidHeaders(false);
    setStep(1);
    setReport(null);
  };

  return (
    <Container>
      <h3>Importação em Massa de Pacientes</h3>
      
      {/* ETAPA 1: Upload */}
      {step === 1 && (
        <>
          <p>Selecione um arquivo .xlsx. As colunas devem ser exatas.</p>
          <UploadBox onClick={() => document.getElementById('fileInput').click()}>
            <input 
              id="fileInput" 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <p>Clique ou arraste o arquivo aqui</p>
          </UploadBox>
          <small>Colunas necessárias: {EXPECTED_HEADERS.join(', ')}</small>
        </>
      )}

      {/* ETAPA 2: Confirmação */}
      {step === 2 && (
        <div style={{ textAlign: 'center' }}>
          <h4>Arquivo: {file.name}</h4>
          <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Colunas Verificadas</p>
          <p>Deseja processar a importação agora?</p>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <Button onClick={reset} style={{ background: '#666' }}>Cancelar</Button>
            <Button onClick={handleImport} disabled={loading}>
              {loading ? 'Processando...' : 'Sim, Importar'}
            </Button>
          </div>
        </div>
      )}

      {/* ETAPA 3: Relatório */}
      {step === 3 && report && (
        <div>
          <h4>Resultado da Importação</h4>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ background: '#d4edda', padding: '10px', borderRadius: '4px' }}>
              <strong>Importados:</strong> {report.summary.importados}
            </div>
            <div style={{ background: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
              <strong>Duplicados (Ignorados):</strong> {report.summary.duplicados}
            </div>
            <div style={{ background: '#f8d7da', padding: '10px', borderRadius: '4px' }}>
              <strong>Erros:</strong> {report.summary.erros}
            </div>
          </div>

          {report.detalhes.duplicados.length > 0 && (
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
              <strong>Lista de Duplicados (CPFs já existentes):</strong>
              <ul>
                {report.detalhes.duplicados.map((d, i) => (
                  <li key={i}>{d.nome} - CPF: {d.cpf}</li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={reset} style={{ marginTop: '20px' }}>Nova Importação</Button>
        </div>
      )}
    </Container>
  );
}