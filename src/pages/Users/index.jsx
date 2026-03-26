import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import { 
  Container, 
  Header, 
  TableContainer, 
  Table, 
  ActionButton,
  UserEmail,
  AdminBadge,
  ProfissionalYes,
  RegistryInfo,
  AdminMatrixBadge,
  OperadorasList,
  OperadoraBadge,
  NoOperadoraText,
  StatusBadge,
  PaginationContainer
} from './styles';
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
                <tr key={user.id} isActive={user.active}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.name}</strong><br />
                    <UserEmail>{user.email}</UserEmail>
                  </td>
                  <td>
                    {user.perfil?.nome || <span style={{ color: '#aaa' }}>Sem Perfil</span>}
                    {user.is_admin && <AdminBadge>(ADMIN)</AdminBadge>}
                  </td>
                  <td>{user.is_profissional ? <ProfissionalYes>Sim</ProfissionalYes> : 'Não'}</td>
                  <td>
                    {user.is_profissional && user.professional ? (
                      <RegistryInfo>
                        <small><b>{user.professional.registry_type}</b>: {user.professional.registry_number}</small>
                        <small className="speciality">{user.professional.speciality?.name || 'Geral'}</small>
                      </RegistryInfo>
                    ) : '-'}
                  </td>

                  <td>
                    {user.is_admin ? (
                      <AdminMatrixBadge>Cic Oncologia</AdminMatrixBadge>
                    ) : user.operadoras && user.operadoras.length > 0 ? (
                      <OperadorasList>
                        {user.operadoras.map(op => (
                          <OperadoraBadge key={op.id}>
                            {op.nome}
                          </OperadoraBadge>
                        ))}
                      </OperadorasList>
                    ) : (
                      <NoOperadoraText>Sem operadora</NoOperadoraText>
                    )}
                  </td>

                  <td>
                    <StatusBadge isActive={user.active}>
                      {user.active ? '● Ativo' : '○ Inativo'}
                    </StatusBadge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionButton className="edit" onClick={() => { setEditingUser(user); setIsModalOpen(true); }}>
                      Editar
                    </ActionButton>
                    <ActionButton
                      className={user.active ? "delete" : "reactivate"}
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.active ? 'Inativar' : 'Reativar'}
                    </ActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {totalPages > 1 && (
          <PaginationContainer>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => c - 1)}
            >
              Anterior
            </button>
            <span>Página <strong>{currentPage}</strong> de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(c => c + 1)}
            >
              Próxima
            </button>
          </PaginationContainer>
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