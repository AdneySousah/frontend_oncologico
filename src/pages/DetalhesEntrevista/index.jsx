import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import * as S from './styles';
import EvaluationModal from './components/EvaluationModal';
import TermoModal from './components/TermoModal';
import { LuArrowUpDown } from "react-icons/lu";

export default function ListaEntrevistas() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEntrevista, setSelectedEntrevista] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [termoModalOpen, setTermoModalOpen] = useState(false);
  const [entrevistaParaTermo, setEntrevistaParaTermo] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get('/evaluations/responses');
      setEntrevistas(res.data);
      console.log(res.data)
    } catch (error) {
      console.error("Erro ao buscar entrevistas", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  const sortedEntrevistas = useMemo(() => {
    return [...entrevistas].sort((a, b) => {
      const dateA = a.data_proximo_contato ? new Date(a.data_proximo_contato) : new Date('9999-12-31');
      const dateB = b.data_proximo_contato ? new Date(b.data_proximo_contato) : new Date('9999-12-31');
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [entrevistas, sortOrder]);

  const getAlertConfig = (item) => {
    if (item.status_avaliacao === 'Concluída' || !item.data_proximo_contato) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contactDate = new Date(item.data_proximo_contato);
    contactDate.setHours(0, 0, 0, 0);

    const diffTime = contactDate - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { color: '#ff4d4f', label: 'ATRASADO/HOJE' };
    if (diffDays <= 1) return { color: '#ff4d4f', label: 'CRÍTICO' };
    if (diffDays <= 3) return { color: '#faad14', label: 'ATENÇÃO' };
    if (diffDays <= 5) return { color: '#52c41a', label: 'PRAZO' };

    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <S.Container>
      <S.Header>
        <h1>Pacientes Entrevistados</h1>
        <p>Monitore os prazos de contato e status das avaliações oncológicas.</p>
      </S.Header>

      <S.Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente / Médico</th>
            <th>Contato</th>
            <th>Operadora</th>
            <th className="sortable" onClick={handleSort}>
              Próximo Contato <LuArrowUpDown size={14} />
            </th>
            <th>Data Entrevista</th>
            <th>Termo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntrevistas.map(item => {
            const alert = getAlertConfig(item);
            const statusTermo = item.paciente?.status_termo || 'Pendente';

            return (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>
                  <div style={{ lineHeight: '1.4' }}>
                    <strong>{item.paciente?.nome} {item.paciente?.sobrenome}</strong><br />
                    <small style={{ opacity: 0.5 }}>CRM: {item.medico?.crm || '---'}</small>
                  </div>
                </td>
                <td>{item.paciente?.celular || item.paciente?.telefone || '-'}</td>
                <td>{item.paciente?.operadoras?.nome || '-'}</td>
                <td>
                  <div style={{ color: alert?.color, fontWeight: alert ? '800' : 'normal' }}>
                    {formatDate(item.data_proximo_contato)}
                    {alert && <div style={{ fontSize: '9px', marginTop: '-2px' }}>{alert.label}</div>}
                  </div>
                </td>

                <td>{formatDate(item.data_contato)}</td>

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
                    done={item.status_avaliacao === 'Concluída'}
                    bg={item.status_avaliacao === 'Parcial' ? 'rgba(250, 173, 20, 0.15)' : null}
                    color={item.status_avaliacao === 'Parcial' ? '#faad14' : null}
                  >
                    {item.status_avaliacao}
                  </S.StatusBadge>
                </td>

                <td>
                  <S.ActionButton
                    mode="create"
                    onClick={() => {
                      // Correção: Verifica se o termo está pendente antes de navegar
                      if (statusTermo !== 'Aceito') {
                        setEntrevistaParaTermo(item);
                        setTermoModalOpen(true);
                      } else {
                        navigate(`/avaliacao/new?entrevista_id=${item.id}&paciente_id=${item.paciente_id}`);
                      }
                    }}
                  >
                    {item.status_avaliacao === 'Parcial' ? 'Continuar' : 'Avaliar'}
                  </S.ActionButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </S.Table>

      <TermoModal
        isOpen={termoModalOpen}
        onClose={() => setTermoModalOpen(false)}
        entrevista={entrevistaParaTermo}
        onSuccess={(entrevistaAtualizada) => {
          // 1. Opcional: recarrega a tabela por baixo dos panos
          load();

          // 2. Fecha o modal
          setTermoModalOpen(false);

          // 3. FAZ A NAVEGAÇÃO para a tela de avaliação passando os IDs corretos!
          navigate(`/avaliacao/new?entrevista_id=${entrevistaAtualizada.id}&paciente_id=${entrevistaAtualizada.paciente_id}`);
        }}
      />
    </S.Container>
  );
}

