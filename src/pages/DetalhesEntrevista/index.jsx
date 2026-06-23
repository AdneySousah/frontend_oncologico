import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import * as S from './styles';

import EvaluationModal from './components/EvaluationModal';
import TermoModal from './components/TermoModal';
import FilterBar from './components/FilterBar';
import Pagination from './components/Pagination';

import { LuArrowUpDown, LuEye, LuRefreshCw } from "react-icons/lu";

export default function ListaEntrevistas() {
  const [pacientesNavegacao, setPacientesNavegacao] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [termoModalOpen, setTermoModalOpen] = useState(false);
  const [pacienteParaTermo, setPacienteParaTermo] = useState(null);
  const [termoStartWaiting, setTermoStartWaiting] = useState(false);

  const [pendentesSync, setPendentesSync] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCheckingSync, setIsCheckingSync] = useState(true);

  const [operadoras, setOperadoras] = useState([]);
  
  // Array de IDs em Segundo Plano
  const [emSegundoPlanoIds, setEmSegundoPlanoIds] = useState([]);

  const [filters, setFilters] = useState({
    buscaGeral: '',
    cuidador: '',
    telefone: '',
    operadora: '', 
    statusTermo: 'Pendente' 
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const usuarioLogado = useMemo(() => {
    const userStorage = localStorage.getItem('oncologico:UserData');
    return userStorage ? JSON.parse(userStorage) : null;
  }, []);

  const nomeOperadoraUsuario = usuarioLogado?.user?.operadora || usuarioLogado?.operadora?.nome;
  const isMaster = nomeOperadoraUsuario === 'CICFARMA';

  useEffect(() => {
    const saved = localStorage.getItem('oncologico:emSegundoPlano');
    if (saved) setEmSegundoPlanoIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('oncologico:emSegundoPlano', JSON.stringify(emSegundoPlanoIds));
  }, [emSegundoPlanoIds]);

  const loadLocalData = async () => {
    try {
      const res = await api.get('/evaluations/responses');
      setPacientesNavegacao(res.data);
    } catch (error) {
      console.error("Erro ao buscar dados locais", error);
    }
  };

  const loadOperadoras = async () => {
    try {
      const res = await api.get('/operadoras'); 
      setOperadoras(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar operadoras", error);
    }
  };

  const checkSyncStatus = async () => {
    try {
      setIsCheckingSync(true);
      const res = await api.get('/sync/pacientes/check');
      setPendentesSync(res.data.pendentes);
    } catch (error) {
      console.error("Erro ao verificar status", error);
    } finally {
      setIsCheckingSync(false);
    }
  };

  useEffect(() => {
    loadLocalData();
    loadOperadoras(); 
    checkSyncStatus();
  }, []);

  // POLLING DE 2º PLANO
  useEffect(() => {
    if (emSegundoPlanoIds.length === 0) return;

    const interval = setInterval(async () => {
      let requiresUpdate = false;
      let currentMailbox = JSON.parse(localStorage.getItem('oncologico:mailbox') || '[]');
      let hasNewMail = false;
      
      for (const id of emSegundoPlanoIds) {
        try {
          const res = await api.get(`/termos/paciente/${id}/status`);
          const statusAtual = res.data.status_termo;

          if (statusAtual === 'Aceito' || statusAtual === 'Recusado') {
            const pacienteDetalhe = pacientesNavegacao.find(p => p.id === id);
            const nomeCompleto = pacienteDetalhe ? `${pacienteDetalhe.nome} ${pacienteDetalhe.sobrenome}` : `Paciente #${id}`;

            if (statusAtual === 'Aceito') {
              toast.info(`O paciente ${nomeCompleto} aceitou o termo! Verifique a sua caixa de entrada flutuante.`, { autoClose: 7000 });
              
              if (!currentMailbox.some(m => m.id === id)) {
                currentMailbox.push({ id, nome: nomeCompleto, data: new Date().toISOString() });
                hasNewMail = true;
              }
            } else {
              toast.error(`Atenção: O paciente ${nomeCompleto} RECUSOU o termo.`, { autoClose: 7000 });
            }
            
            setEmSegundoPlanoIds(prev => prev.filter(pid => pid !== id));
            requiresUpdate = true;
          }
        } catch (error) {
          console.error(`Erro no polling de segundo plano para o ID ${id}`, error);
        }
      }

      if (hasNewMail) {
        localStorage.setItem('oncologico:mailbox', JSON.stringify(currentMailbox));
        window.dispatchEvent(new Event('updateMailbox'));
      }

      if (requiresUpdate) {
        loadLocalData();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [emSegundoPlanoIds, pacientesNavegacao]);

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
      toast.error("Houve um erro ao sincronizar.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStartAvaliacao = (id) => {
    const currentMailbox = JSON.parse(localStorage.getItem('oncologico:mailbox') || '[]');
    const updatedMailbox = currentMailbox.filter(m => m.id !== id);
    localStorage.setItem('oncologico:mailbox', JSON.stringify(updatedMailbox));
    window.dispatchEvent(new Event('updateMailbox'));
    
    navigate(`/avaliacao/new?paciente_id=${id}`);
  };

  const termoCounts = useMemo(() => {
    let baseData = [...pacientesNavegacao];
    if (!isMaster && nomeOperadoraUsuario) {
      baseData = baseData.filter(paciente => paciente.operadoras?.nome === nomeOperadoraUsuario);
    }

    const counts = { Aceito: 0, Recusado: 0, Pendente: 0, Todos: baseData.length, SegundoPlano: 0 };
    
    baseData.forEach(p => {
      const status = p.status_termo || 'Pendente';
      if (counts[status] !== undefined) counts[status]++;
      else counts['Pendente']++;
      
      if (emSegundoPlanoIds.includes(p.id)) counts.SegundoPlano++;
    });

    return counts;
  }, [pacientesNavegacao, isMaster, nomeOperadoraUsuario, emSegundoPlanoIds]);

  const filteredAndSortedPacientes = useMemo(() => {
    let result = [...pacientesNavegacao];

    if (!isMaster && nomeOperadoraUsuario) {
      result = result.filter(paciente => paciente.operadoras?.nome === nomeOperadoraUsuario);
    }

    if (filters.statusTermo === 'SegundoPlano') {
      result = result.filter(p => emSegundoPlanoIds.includes(p.id));
    } else if (filters.statusTermo && filters.statusTermo !== 'Todos') {
      result = result.filter(p => (p.status_termo || 'Pendente') === filters.statusTermo);
    }

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

    return result.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
    });
  }, [pacientesNavegacao, sortOrder, isMaster, nomeOperadoraUsuario, filters, emSegundoPlanoIds]);

  const paginatedPacientes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPacientes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPacientes, currentPage, itemsPerPage]);

  const formatPrice = (price) => {
    if (!price) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const changeStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, statusTermo: status }));
  };

  return (
    <S.Container>
      <S.Header>
        <div className="title-section">
          <h1>Navegação de Pacientes</h1>
          <p>Monitore o status das avaliações oncológicas diretas e priorize os atendimentos de alto custo.</p>
        </div>

        <S.SyncPanel>
          {isCheckingSync ? (
            <span className="status-text checking">🔄 Verificando novos pacientes...</span>
          ) : pendentesSync > 0 ? (
            <span className="status-text pending">⚠️ {pendentesSync} aguardando sincronização!</span>
          ) : (
            <span className="status-text synced">✅ Banco atualizado.</span>
          )}

          <S.ActionButton
            className="sync-btn"
            onClick={handleManualSync} disabled={isSyncing || isCheckingSync}
          >
            <LuRefreshCw size={14} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </S.ActionButton>
        </S.SyncPanel>
      </S.Header>

      <S.CountersContainer>
        <S.CounterCircle color="#faad14" active={filters.statusTermo === 'Pendente'} onClick={() => changeStatusFilter('Pendente')}>
          <span className="count">{termoCounts.Pendente}</span>
          <span className="label">Pendentes</span>
        </S.CounterCircle>

        <S.CounterCircle color="#8a2be2" active={filters.statusTermo === 'SegundoPlano'} onClick={() => changeStatusFilter('SegundoPlano')}>
          <span className="count">{termoCounts.SegundoPlano}</span>
          <span className="label">Em 2º Plano</span>
        </S.CounterCircle>

        <S.CounterCircle color="#52c41a" active={filters.statusTermo === 'Aceito'} onClick={() => changeStatusFilter('Aceito')}>
          <span className="count">{termoCounts.Aceito}</span>
          <span className="label">Aceitos</span>
        </S.CounterCircle>

        <S.CounterCircle color="#f5222d" active={filters.statusTermo === 'Recusado'} onClick={() => changeStatusFilter('Recusado')}>
          <span className="count">{termoCounts.Recusado}</span>
          <span className="label">Recusados</span>
        </S.CounterCircle>

        <S.CounterCircle color="#1890ff" active={filters.statusTermo === 'Todos'} onClick={() => changeStatusFilter('Todos')}>
          <span className="count">{termoCounts.Todos}</span>
          <span className="label">Todos</span>
        </S.CounterCircle>
      </S.CountersContainer>

      <FilterBar filters={filters} setFilters={setFilters} pacientes={pacientesNavegacao} isMaster={isMaster} operadoras={operadoras} />

      <S.TableWrapper>
        <S.Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Contato</th>
              {/* Colunas consolidadas */}
              <th>Cuidador</th>
              <th>Operadora</th>
              <th className="sortable" onClick={handleSort}>
                Medicamento / Custo <LuArrowUpDown size={14} />
              </th>
              <th>Termo / Avaliação.</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPacientes.map(paciente => {
              const statusTermo = paciente.status_termo || 'Pendente';
              const isHighlighted = highlightId === String(paciente.id);
              const nomeOperadora = paciente.operadoras?.nome || '-';
              const nomeMedicamento = paciente.medicamento?.nome || 'Não informado';
              
              const isEmSegundoPlano = emSegundoPlanoIds.includes(paciente.id);

              return (
                <tr key={paciente.id} id={`row-${paciente.id}`} style={isHighlighted ? { backgroundColor: 'rgba(250, 173, 20, 0.2)', transition: 'background-color 2s' } : {}}>
                  <td>#{paciente.id}</td>
                  <td>
                    <div style={{ lineHeight: '1.4' }}>
                      <strong>{paciente.nome} {paciente.sobrenome}</strong><br />
                      <small style={{ opacity: 0.6 }}>CPF: {paciente.cpf}</small>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{paciente.celular || paciente.telefone || '-'}</td>

                  {/* CUIDADOR CONSOLIDADO */}
                  <td>
                    {paciente.possui_cuidador ? (
                      <div style={{ lineHeight: '1.4' }}>
                        <strong>{paciente.nome_cuidador || 'Não informado'}</strong><br />
                        <small style={{ opacity: 0.8 }}>{paciente.contato_cuidador || '-'}</small>
                      </div>
                    ) : (
                      <S.StatusBadge bg="rgba(108, 117, 125, 0.1)" color="#6c757d">
                        Não Possui
                      </S.StatusBadge>
                    )}
                  </td>
                  
                  <td>{nomeOperadora}</td>

                  <td>
                    <div style={{ lineHeight: '1.4' }}>
                      <span title={nomeMedicamento} style={{ maxWidth: '150px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <strong>{nomeMedicamento}</strong>
                      </span>
                      <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                        {formatPrice(paciente.price)}
                      </span>
                    </div>
                  </td>

                  {/* TERMO E AVALIAÇÃO CONSOLIDADOS */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <S.StatusBadge
                        bg={statusTermo === 'Aceito' ? 'rgba(82, 196, 26, 0.15)' : statusTermo === 'Recusado' ? 'rgba(245, 34, 45, 0.15)' : 'rgba(250, 173, 20, 0.15)'}
                        color={statusTermo === 'Aceito' ? '#52c41a' : statusTermo === 'Recusado' ? '#f5222d' : '#faad14'}
                      >
                        {statusTermo}
                      </S.StatusBadge>
                      
                      <S.StatusBadge 
                        done={paciente.status_avaliacao === 'Concluída'} 
                        bg={paciente.status_avaliacao === 'Parcial' ? 'rgba(250, 173, 20, 0.15)' : null} 
                        color={paciente.status_avaliacao === 'Parcial' ? '#faad14' : null}
                      >
                        {paciente.status_avaliacao}
                      </S.StatusBadge>
                    </div>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <S.ActionButton
                        mode="create"
                        style={isEmSegundoPlano ? { backgroundColor: '#8a2be2', borderColor: '#8a2be2' } : {}}
                        onClick={() => {
                          if (statusTermo !== 'Aceito') {
                            setPacienteParaTermo(paciente);
                            setTermoStartWaiting(isEmSegundoPlano);
                            setTermoModalOpen(true);
                          } else {
                            handleStartAvaliacao(paciente.id);
                          }
                        }}
                      >
                        {statusTermo === 'Aceito' ? 'Avaliar' : isEmSegundoPlano ? 'Aguardando' : paciente.status_avaliacao === 'Parcial' ? 'Continuar' : 'Termo'}
                      </S.ActionButton>

                      <S.ActionButton className="view-btn" onClick={() => { setSelectedPaciente(paciente); setModalOpen(true); }} title="Ver Histórico">
                        <LuEye size={16} />
                      </S.ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {paginatedPacientes.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>Nenhum paciente encontrado para os filtros atuais.</td></tr>
            )}
          </tbody>
        </S.Table>
      </S.TableWrapper>

      {filteredAndSortedPacientes.length > 0 && (
        <Pagination totalItems={filteredAndSortedPacientes.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setItemsPerPage={setItemsPerPage} setCurrentPage={setCurrentPage} />
      )}

      <TermoModal
        isOpen={termoModalOpen}
        onClose={() => setTermoModalOpen(false)}
        paciente={pacienteParaTermo}
        startWaiting={termoStartWaiting}
        onBackground={(id) => {
          setEmSegundoPlanoIds(prev => {
            if (!prev.includes(id)) return [...prev, id];
            return prev;
          });
          toast.info(`O paciente foi colocado em 2º plano. Você será notificado quando ele responder.`);
        }}
        onSuccess={(pacienteAtualizado) => {
          setEmSegundoPlanoIds(prev => prev.filter(pid => pid !== pacienteAtualizado.id));
          loadLocalData();
          setTermoModalOpen(false);
          window.dispatchEvent(new Event('updateAlerts'));
          handleStartAvaliacao(pacienteAtualizado.id);
        }}
      />

      <EvaluationModal isOpen={modalOpen} data={selectedPaciente} onClose={() => { setModalOpen(false); setSelectedPaciente(null); }} />
    </S.Container>
  );
}