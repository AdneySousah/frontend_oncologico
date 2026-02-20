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

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta operadora?')) {
      try {
        await api.delete(`/operadoras/${id}`);
        toast.success('Operadora excluída.');
        loadOperadoras();
      } catch (err) {
        toast.error('Erro ao excluir operadora.');
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
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Carregando...</td></tr>
            ) : operadoras.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Nenhuma operadora cadastrada.</td></tr>
            ) : (
              operadoras.map((op) => (
                <tr key={op.id}>
                  <td>#{op.id}</td>
                  <td><strong>{op.nome}</strong></td>
                  <td>{op.cnpj}</td>
                  <td>{op.telefone}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={renderEmails(op.email)}>
                    {renderEmails(op.email)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionButton className="edit" onClick={() => handleEdit(op)}>Editar</ActionButton>
                    <ActionButton className="delete" onClick={() => handleDelete(op.id)}>Excluir</ActionButton>
                  </td>
                </tr>
              ))
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