import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

// Componentes e Estilos
import { Container, Header, TableContainer, Table, ActionButton } from './styles';
import UserModal from './components/UserModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Carregar Usuários
  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Erro ao carregar usuários.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Abrir Modal de Criação
  const handleNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Abrir Modal de Edição
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Deletar Usuário
  const handleDeleteUser = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('Usuário desativado.');
        loadUsers(); // Recarrega a lista
      } catch (err) {
        toast.error('Erro ao desativar usuário.');
      }
    }
  };

  // Componente auxiliar para renderizar os Badges de Perfil
  const renderBadges = (user) => {
    return (
      <div style={{ display: 'flex', gap: '5px' }}>
        {user.is_admin && (
          <span style={{ 
            backgroundColor: '#722ed1', // Roxo
            color: 'white', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            ADMIN
          </span>
        )}
        {user.is_profissional && (
          <span style={{ 
            backgroundColor: '#13c2c2', // Ciano
            color: 'white', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            PRO
          </span>
        )}
        {!user.is_admin && !user.is_profissional && (
           <span style={{ 
            backgroundColor: '#8c8c8c', // Cinza
            color: 'white', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            COMUM
          </span>
        )}
      </div>
    );
  };

  return (
    <Container>
      <Header>
        <h1>Gerenciamento de Usuários</h1>
        <button onClick={handleNewUser}>+ Novo Usuário</button>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Operadoras</th> {/* Nova Coluna */}
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Carregando...</td>
              </tr>
            ) : users.length === 0 ? (
               <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum usuário encontrado.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {renderBadges(user)}
                  </td>
                  {/* Renderização das Operadoras */}
                  <td>
                    {user.operadoras && user.operadoras.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {user.operadoras.map(op => (
                          <span key={op.id} style={{
                            backgroundColor: '#e6f7ff',
                            border: '1px solid #91d5ff',
                            color: '#0050b3',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}>
                            {op.nome}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Nenhuma</span>
                    )}
                  </td>
                  <td>
                    {user.active ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Ativo</span>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Inativo</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionButton 
                      className="edit" 
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Excluir
                    </ActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {/* Modal Component */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userToEdit={editingUser}
        onSuccess={loadUsers} 
      />
    </Container>
  );
};

export default UsersPage;