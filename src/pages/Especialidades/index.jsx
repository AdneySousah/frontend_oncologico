import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Container, Header, TableContainer, Table } from './styles';
import SpecialtyModal from './components/SpecialtyModal';

const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSpecialties = async () => {
    try {
      const response = await api.get('/specialities');
      setSpecialties(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Erro ao carregar especialidades.');
      setLoading(false);
    }
  };

  useEffect(() => { loadSpecialties(); }, []);

  return (
    <Container>
      <Header>
        <h1>Especialidades</h1>
        <button onClick={() => setIsModalOpen(true)}>+ Nova Especialidade</button>
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
            ) : specialties.map((spec) => (
              <tr key={spec.id}>
                <td>#{spec.id}</td>
                <td>{spec.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <SpecialtyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadSpecialties} 
      />
    </Container>
  );
};

export default SpecialtiesPage;