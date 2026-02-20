import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { LuPencil, LuPlus } from "react-icons/lu";

// Reutilizando seus estilos de tabela padronizados
import { Container, Header, TableContainer, Table, ActionButton } from '../Users/styles'; 
import DiagnosticoModal from './components/DiagnosticoModal';

const DiagnosticosPage = () => {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagToEdit, setDiagToEdit] = useState(null);

  const loadDiagnosticos = async () => {
    try {
      const response = await api.get('/diagnosticos');
      setDiagnosticos(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Erro ao carregar diagnósticos.');
      setLoading(false);
    }
  };

  useEffect(() => { loadDiagnosticos(); }, []);

  const handleNew = () => {
    setDiagToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (diag) => {
    setDiagToEdit(diag);
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Header>
        <h1>Cadastros de Diagnósticos (CID)</h1>
        <button onClick={handleNew}>
          <LuPlus style={{marginRight: '8px'}}/> Novo Diagnóstico
        </button>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Diagnóstico / CID</th>
              <th style={{ textAlign: 'right', width: '120px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{textAlign:'center'}}>Carregando...</td></tr>
            ) : diagnosticos.length === 0 ? (
              <tr><td colSpan="3" style={{textAlign:'center'}}>Nenhum diagnóstico cadastrado.</td></tr>
            ) : (
              diagnosticos.map((diag) => (
                <tr key={diag.id}>
                  <td>#{diag.id}</td>
                  <td><strong>{diag.diagnostico}</strong></td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionButton onClick={() => handleEdit(diag)}>
                      <LuPencil size={18} />
                    </ActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      <DiagnosticoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        diagToEdit={diagToEdit}
        onSuccess={loadDiagnosticos} 
      />
    </Container>
  );
};

export default DiagnosticosPage;