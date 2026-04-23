import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import * as S from './styles';

import EvaluationModal from './components/EvaluationModal';
import TermoModal from './components/TermoModal';
import FilterBar from './components/FilterBar';       // <-- NOVO IMPORT
import Pagination from './components/Pagination';     // <-- NOVO IMPORT

import { LuArrowUpDown, LuEye, LuRefreshCw } from "react-icons/lu";

export default function ListaEntrevistas() {
  const [pacientesNavegacao, setPacientesNavegacao] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [termoModalOpen, setTermoModalOpen] = useState(false);
  const [pacienteParaTermo, setPacienteParaTermo] = useState(null);

  const [pendentesSync, setPendentesSync] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCheckingSync, setIsCheckingSync] = useState(true);

  // --- NOVOS ESTADOS: FILTROS E PAGINAÇÃO ---
  const [filters, setFilters] = useState({
    buscaGeral: '',
    cuidador: '',
    telefone: '',
    operadora: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const usuarioLogado = useMemo(() => {
    const userStorage = localStorage.getItem('@SeuApp:user');
    return userStorage ? JSON.parse(userStorage) : null;
  }, []);

  const nomeOperadoraUsuario = usuarioLogado?.company?.name || usuarioLogado?.operadora?.nome;
  const isMaster = nomeOperadoraUsuario === 'CLÍNICA DE INFUSÃO COMPARTILHADA';

  const loadLocalData = async () => {
    try {
      const res = await api.get('/evaluations/responses');
      setPacientesNavegacao(res.data);
    } catch (error) {
      console.error("Erro ao buscar dados locais", error);
    }
  };

  const checkSyncStatus = async () => {
    try {
      setIsCheckingSync(true);
      const res = await api.get('/sync/pacientes/check');
      setPendentesSync(res.data.pendentes);
    } catch (error) {
      console.error("Erro ao verificar status de sincronização", error);
    } finally {
      setIsCheckingSync(false);
    }
  };

  useEffect(() => {
    loadLocalData();
    checkSyncStatus();
  }, []);

  // Reseta para a página 1 sempre que os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (highlightId && pacientesNavegacao.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`row-${highlightId}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [highlightId, pacientesNavegacao]);

  const handleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      await api.post('/pacientes/sync');
      await loadLocalData();
      await checkSyncStatus();
    } catch (error) {
      console.error("Erro ao realizar sincronização manual", error);
      alert("Houve um erro ao sincronizar. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  // =========================================================================
  // LÓGICA DE FILTRAGEM COMBINADA E ORDENAÇÃO
  // =========================================================================
  const filteredAndSortedPacientes = useMemo(() => {
    let result = [...pacientesNavegacao];

    // 1. Regra de Negócio (Master vs Operadora)
    if (!isMaster && nomeOperadoraUsuario) {
      result = result.filter(paciente => paciente.operadoras?.nome === nomeOperadoraUsuario);
    }

    // 2. Filtros de Busca Combinada
    if (filters.buscaGeral) {
      const termo = filters.buscaGeral.toLowerCase();
      result = result.filter(p => 
        p.nome?.toLowerCase().includes(termo) ||
        p.sobrenome?.toLowerCase().includes(termo) ||
        p.cpf?.includes(termo)
      );
    }

    if (filters.cuidador) {
      const termo = filters.cuidador.toLowerCase();
      result = result.filter(p => p.nome_cuidador?.toLowerCase().includes(termo));
    }

    if (filters.telefone) {
      // Limpa os caracteres do filtro para buscar apenas números
      const termo = filters.telefone.replace(/\D/g, '');
      result = result.filter(p => {
        const cel = p.celular ? p.celular.replace(/\D/g, '') : '';
        const tel = p.telefone ? p.telefone.replace(/\D/g, '') : '';
        return cel.includes(termo) || tel.includes(termo);
      });
    }

    if (filters.operadora) {
      result = result.filter(p => p.operadoras?.nome === filters.operadora);
    }

    // 3. Ordenação por preço
    return result.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
    });
  }, [pacientesNavegacao, sortOrder, isMaster, nomeOperadoraUsuario, filters]);

  // =========================================================================
  // LÓGICA DE PAGINAÇÃO (Fatiamento do Array final)
  // =========================================================================
  const paginatedPacientes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPacientes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPacientes, currentPage, itemsPerPage]);

  const formatPrice = (price) => {
    if (!price) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <S.Container>
      <S.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Navegação de Pacientes</h1>
          <p>Monitore o status das avaliações oncológicas diretas e priorize os atendimentos de alto custo.</p>
        </div>

        <S.SyncPanel>
          {/* LÓGICA DE AVISO DINÂMICO DE SINCRONIZAÇÃO */}
          {isCheckingSync ? (
            <span style={{ fontSize: '14px', color: '#888', fontWeight: 'bold' }}>
              🔄 Verificando novos pacientes no servidor...
            </span>
          ) : pendentesSync > 0 ? (
            <span style={{ fontSize: '14px', color: '#faad14', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ⚠️ Há {pendentesSync} novo(s) paciente(s) aguardando sincronização!
            </span>
          ) : (
            <span style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ✅ Banco de pacientes atualizado.
            </span>
          )}

          <S.ActionButton
            style={{
              backgroundColor: '#1890ff',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              opacity: isSyncing || isCheckingSync ? 0.7 : 1,
              cursor: isSyncing || isCheckingSync ? 'not-allowed' : 'pointer'
            }}
            onClick={handleManualSync}
            disabled={isSyncing || isCheckingSync}
          >
            <LuRefreshCw size={16} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </S.ActionButton>
        </S.SyncPanel>
      </S.Header>

      {/* --- RENDER DO FILTRO --- */}
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        pacientes={pacientesNavegacao} 
        isMaster={isMaster} 
      />

      <S.Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Contato</th>
            <th>Cuidador?</th>
            <th>Nome Cuidador</th>
            <th>Contato Cuidador</th>
            <th>Operadora</th>
            <th className="sortable" onClick={handleSort}>
              Medicamento / Custo <LuArrowUpDown size={14} />
            </th>
            <th>Termo</th>
            <th>Status</th>
            <th style={{ textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* MUDOU DE sortedPacientes PARA paginatedPacientes */}
          {paginatedPacientes.map(paciente => {
            const statusTermo = paciente.status_termo || 'Pendente';
            const isHighlighted = highlightId === String(paciente.id);
            const nomeOperadora = paciente.operadoras?.nome || '-';
            const nomeMedicamento = paciente.medicamento?.nome || 'Não informado';

            return (
              <tr
                key={paciente.id} id={`row-${paciente.id}`}
                style={isHighlighted ? { backgroundColor: 'rgba(250, 173, 20, 0.2)', transition: 'background-color 2s' } : {}}
              >
                <td>#{paciente.id}</td>
                <td>
                  <div style={{ lineHeight: '1.4' }}>
                    <strong>{paciente.nome} {paciente.sobrenome}</strong><br />
                    <small style={{ opacity: 0.5 }}>CPF: {paciente.cpf}</small>
                  </div>
                </td>
                <td>{paciente.celular || paciente.telefone || '-'}</td>

                <td>
                  <S.StatusBadge bg={paciente.possui_cuidador ? 'rgba(23, 162, 184, 0.15)' : 'rgba(108, 117, 125, 0.15)'} color={paciente.possui_cuidador ? '#17a2b8' : '#6c757d'}>
                    {paciente.possui_cuidador ? 'Sim' : 'Não'}
                  </S.StatusBadge>
                </td>
                <td>{paciente.nome_cuidador || '-'}</td>
                <td>{paciente.contato_cuidador || '-'}</td>
                <td>{nomeOperadora}</td>

                <td>
                  <div style={{ lineHeight: '1.4' }}>
                    <strong>{nomeMedicamento}</strong><br />
                    <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                      {formatPrice(paciente.price)}
                    </span>
                  </div>
                </td>

                <td>
                  <S.StatusBadge
                    bg={statusTermo === 'Aceito' ? 'rgba(82, 196, 26, 0.15)' : 'rgba(250, 173, 20, 0.15)'}
                    color={statusTermo === 'Aceito' ? '#52c41a' : '#faad14'}
                  >
                    {statusTermo}
                  </S.StatusBadge>
                </td>

                <td>
                  <S.StatusBadge
                    done={paciente.status_avaliacao === 'Concluída'}
                    bg={paciente.status_avaliacao === 'Parcial' ? 'rgba(250, 173, 20, 0.15)' : null}
                    color={paciente.status_avaliacao === 'Parcial' ? '#faad14' : null}
                  >
                    {paciente.status_avaliacao}
                  </S.StatusBadge>
                </td>

                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <S.ActionButton
                      mode="create"
                      onClick={() => {
                        if (statusTermo !== 'Aceito') {
                          setPacienteParaTermo(paciente);
                          setTermoModalOpen(true);
                        } else {
                          navigate(`/avaliacao/new?paciente_id=${paciente.id}`);
                        }
                      }}
                    >
                      {paciente.status_avaliacao === 'Parcial' ? 'Continuar' : 'Avaliar'}
                    </S.ActionButton>

                    <S.ActionButton
                      style={{ backgroundColor: '#17a2b8', color: '#fff', padding: '8px 12px' }}
                      onClick={() => {
                        setSelectedPaciente(paciente);
                        setModalOpen(true);
                      }}
                      title="Ver Histórico"
                    >
                      <LuEye size={18} />
                    </S.ActionButton>
                  </div>
                </td>
              </tr>
            );
          })}
          
          {paginatedPacientes.length === 0 && (
            <tr>
              <td colSpan="11" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                Nenhum paciente encontrado para os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </S.Table>

      {/* --- RENDER DA PAGINAÇÃO --- */}
      {filteredAndSortedPacientes.length > 0 && (
        <Pagination 
          totalItems={filteredAndSortedPacientes.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      <TermoModal
        isOpen={termoModalOpen}
        onClose={() => setTermoModalOpen(false)}
        paciente={pacienteParaTermo}
        onSuccess={(pacienteAtualizado) => {
          loadLocalData();
          setTermoModalOpen(false);
          window.dispatchEvent(new Event('updateAlerts'));
          navigate(`/avaliacao/new?paciente_id=${pacienteAtualizado.id}`);
        }}
      />

      <EvaluationModal
        isOpen={modalOpen}
        data={selectedPaciente}
        onClose={() => {
          setModalOpen(false);
          setSelectedPaciente(null);
        }}
      />
    </S.Container>
  );
}