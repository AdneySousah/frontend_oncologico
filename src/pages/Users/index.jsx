import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import { Container, Header, TableContainer, Table, ActionButton } from './styles';
import UserModal from './components/UserModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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

  const handleNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('Usuário desativado.');
        loadUsers(); 
      } catch (err) {
        toast.error('Erro ao desativar usuário.');
      }
    }
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
              <th>Acesso (Grupo)</th>
              <th>Profissional?</th>
              <th>Registro / Especialidade</th>
              <th>Operadoras</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Carregando...</td>
              </tr>
            ) : users.length === 0 ? (
               <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Nenhum usuário encontrado.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.name}</strong><br/>
                    <small style={{ color: '#888' }}>{user.email}</small>
                  </td>
                  
                  {/* Mostra o Perfil vinculado ao usuário */}
                  <td>
                    {user.perfil ? (
                      <span style={{ fontWeight: 'bold', color: '#333' }}>{user.perfil.nome}</span>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Sem Perfil</span>
                    )}
                    {user.is_admin && <span style={{ marginLeft: '5px', color: 'red', fontSize: '0.7rem' }}>(Admin)</span>}
                  </td>

                  {/* Mostra se é Profissional */}
                  <td>
                    {user.is_profissional ? (
                      <span style={{ color: '#13c2c2', fontWeight: 'bold' }}>Sim</span>
                    ) : (
                      <span style={{ color: '#8c8c8c' }}>Não</span>
                    )}
                  </td>

                  {/* Mostra os dados do CRM e Especialidade */}
                  <td>
                     {user.is_profissional && user.professional ? (
                        <>
                          <strong>{user.professional.registry_type}</strong>: {user.professional.registry_number} <br/>
                          <small>{user.professional.speciality?.name || 'Sem especialidade'}</small>
                        </>
                     ) : (
                       <span style={{ color: '#aaa' }}>-</span>
                     )}
                  </td>

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