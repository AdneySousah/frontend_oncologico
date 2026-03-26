import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { theme } from '../../themes/theme'; // Ajuste o caminho conforme seu projeto

import { Container, Header, TableContainer, Table, ActionButton } from './styles';
import UserModal from './components/UserModal';
import SearchBar from '../../components/SearchBar';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Estados de Controle
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactives, setShowInactives] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      toast.error('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  // Lógica de Filtro e Busca
  const filteredData = useMemo(() => {
    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      // Se showInactives for false, mostra apenas active === true
      // Se showInactives for true, mostra todos
      const matchesStatus = showInactives ? true : user.active === true;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, showInactives]);

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedUsers = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleStatus = async (user) => {
    const actionText = user.active ? 'desativar' : 'reativar';
    if (window.confirm(`Tem certeza que deseja ${actionText} este usuário?`)) {
      try {
        await api.delete(`/users/${user.id}`);
        toast.success(`Usuário ${user.active ? 'desativado' : 'ativado'} com sucesso.`);
        loadUsers();
      } catch (err) {
        toast.error('Erro ao alterar status do usuário.');
      }
    }
  };

  return (
    <Container>
      <Header>
        <h1>Gerenciamento de Usuários</h1>
        <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
          + Novo Usuário
        </button>
      </Header>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showInactives={showInactives}
        setShowInactives={(val) => { setShowInactives(val); setCurrentPage(1); }}
      />

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
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</td></tr>
            ) : paginatedUsers.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum usuário encontrado.</td></tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} style={{ opacity: user.active ? 1 : 0.55 }}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.name}</strong><br />
                    <small style={{ color: '#888' }}>{user.email}</small>
                  </td>
                  <td>
                    {user.perfil?.nome || <span style={{ color: '#aaa' }}>Sem Perfil</span>}
                    {user.is_admin && <span style={{ marginLeft: '5px', color: '#d9534f', fontSize: '0.7rem', fontWeight: 'bold' }}>(ADMIN)</span>}
                  </td>
                  <td>{user.is_profissional ? <b style={{ color: '#13c2c2' }}>Sim</b> : 'Não'}</td>
                  <td>
                    {user.is_profissional && user.professional ? (
                      <>
                        <small><b>{user.professional.registry_type}</b>: {user.professional.registry_number}</small><br />
                        <small style={{ fontSize: '0.7rem' }}>{user.professional.speciality?.name || 'Geral'}</small>
                      </>
                    ) : '-'}
                  </td>

                 
                  <td>
                    {user.is_admin ? (
                      /* Lógica para ADMIN - Exibe a matriz "Cic Oncologia" */
                      <span style={{
                        backgroundColor: '#e6f7ff', // Azul clarinho de fundo
                        border: '1px solid #91d5ff',   // Borda azul um pouco mais escura
                        color: '#0050b3',             // TEXTO AZUL ESCURO (para contraste perfeito)
                        padding: '3px 10px',          // Mais respiro
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)', // Sombra sutil para "pular" do fundo preto
                        display: 'inline-block'
                      }}>
                        Cic Oncologia
                      </span>
                    ) : user.operadoras && user.operadoras.length > 0 ? (
                      /* Lógica para Usuário Comum - Lista as operadoras vinculadas */
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '200px' }}>
                        {user.operadoras.map(op => (
                          <span key={op.id} style={{
                            backgroundColor: '#f5f5f5',  // Fundo cinza bem claro
                            border: '1px solid #d9d9d9', // Borda cinza média
                            color: '#262626',            // TEXTO QUASE PRETO (contraste garantido)
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            display: 'inline-block'
                          }}>
                            {op.nome}
                          </span>
                        ))}
                      </div>
                    ) : (
                      /* Se não houver vínculo */
                      <span style={{ color: theme.colors.textLight || '#aaa', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Sem operadora
                      </span>
                    )}
                  </td>

                  <td>
                    <span style={{
                      color: user.active ? '#52c41a' : '#f5222d',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>
                      {user.active ? '● Ativo' : '○ Inativo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionButton className="edit" onClick={() => { setEditingUser(user); setIsModalOpen(true); }}>
                      Editar
                    </ActionButton>
                    <ActionButton
                      className="delete"
                      onClick={() => handleToggleStatus(user)}
                      style={!user.active ? { color: '#52c41a', borderColor: '#52c41a' } : {}}
                    >
                      {user.active ? 'Inativar' : 'Reativar'}
                    </ActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Paginação Estilizada */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', gap: '15px', borderTop: '1px solid #eee' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => c - 1)}
              style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>
            <span style={{ fontSize: '0.9rem' }}>Página <strong>{currentPage}</strong> de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(c => c + 1)}
              style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Próxima
            </button>
          </div>
        )}
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