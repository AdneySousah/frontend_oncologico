import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Container, Header, TableContainer, Table } from './styles';
import ReacaoAdversaModal from './components/ReacaoAdversaModal';

const ReacoesAdversasPage = () => {
  const [reacoes, setReacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReacoes = async () => {
    try {
      const response = await api.get('/reacao-adversa');
      setReacoes(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Erro ao carregar reações adversas.');
      setLoading(false);
    }
  };

  useEffect(() => { loadReacoes(); }, []);

  return (
    <Container>
      <Header>
        <h1>Reações Adversas</h1>
        <button onClick={() => setIsModalOpen(true)}>+ Nova Reação</button>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="2">Carregando...</td></tr>
            ) : reacoes.map((reacao) => (
              <tr key={reacao.id}>
                <td>#{reacao.id}</td>
                <td>{reacao.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <ReacaoAdversaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadReacoes} 
      />
    </Container>
  );
};

export default ReacoesAdversasPage;