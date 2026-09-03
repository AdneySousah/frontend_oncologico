import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import { Container, Header, TableContainer, Table, ActionButton } from './styles';
import OperadoraModal from './components/OperadoraModal';

const OperadorasPage = () => {
  const [operadoras, setOperadoras] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperadora, setEditingOperadora] = useState(null);

  const loadOperadoras = async () => {
    try {
      const response = await api.get('/operadoras');
      setOperadoras(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Erro ao carregar operadoras.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperadoras();
  }, []);

  const handleNew = () => {
    setEditingOperadora(null);
    setIsModalOpen(true);
  };

  const handleEdit = (operadora) => {
    setEditingOperadora(operadora);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (operadora) => {
    const inativo = operadora.is_active === false;
    const acao = inativo ? 'reativar' : 'desativar';

    if (window.confirm(`Tem certeza que deseja ${acao} a operadora "${operadora.nome}"?`)) {
      try {
        await api.patch(`/operadoras/${operadora.id}/status`);
        toast.success(`Operadora ${inativo ? 'reativada' : 'desativada'} com sucesso.`);
        loadOperadoras();
      } catch (err) {
        toast.error(`Erro ao ${acao} operadora.`);
      }
    }
  };

  // Helper para exibir emails na tabela
  const renderEmails = (emailData) => {
    if (Array.isArray(emailData)) {
      return emailData.join(', ');
    }
    return emailData;
  };

  return (
    <Container>
      <Header>
        <h1>Gestão de Operadoras</h1>
        <button onClick={handleNew}>+ Nova Operadora</button>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>E-mails</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign:'center'}}>Carregando...</td></tr>
            ) : operadoras.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center'}}>Nenhuma operadora cadastrada.</td></tr>
            ) : (
              operadoras.map((op) => {
                const inativo = op.is_active === false;
                return (
                  <tr key={op.id} style={{ backgroundColor: inativo ? 'rgba(255, 60, 60, 0.08)' : 'transparent' }}>
                    <td>#{op.id}</td>
                    <td><strong>{op.nome}</strong></td>
                    <td>{op.cnpj}</td>
                    <td>{op.telefone}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={renderEmails(op.email)}>
                      {renderEmails(op.email)}
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        background: inativo ? '#d19399' : '#28a745'
                      }}>
                        {inativo ? 'Inativa' : 'Ativa'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <ActionButton className="edit" onClick={() => handleEdit(op)}>Editar</ActionButton>
                      <ActionButton
                        className={inativo ? 'activate' : 'delete'}
                        onClick={() => handleToggleActive(op)}
                      >
                        {inativo ? 'Reativar' : 'Desativar'}
                      </ActionButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableContainer>

      <OperadoraModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        operadoraToEdit={editingOperadora}
        onSuccess={loadOperadoras} 
      />
    </Container>
  );
};

export default OperadorasPage;