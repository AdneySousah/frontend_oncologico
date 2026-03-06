import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import * as S from './styles';

import EvaluationModal from './components/EvaluationModal'; 
import TermoModal from './components/TermoModal';
import { LuArrowUpDown, LuEye } from "react-icons/lu"; 

export default function ListaEntrevistas() {
  const [pacientesNavegacao, setPacientesNavegacao] = useState([]);
  // Mudamos o padrão para 'desc' para priorizar os mais caros primeiro
  const [sortOrder, setSortOrder] = useState('desc'); 
  
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [termoModalOpen, setTermoModalOpen] = useState(false);
  const [pacienteParaTermo, setPacienteParaTermo] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const load = async () => {
    try {
      const res = await api.get('/evaluations/responses');
      setPacientesNavegacao(res.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => { load(); }, []);

  // Efeito de Scroll
  useEffect(() => {
    if (highlightId && pacientesNavegacao.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`row-${highlightId}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500); 
    }
  }, [highlightId, pacientesNavegacao]);

  const handleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  // Nova regra de ordenação baseada no price
  const sortedPacientes = useMemo(() => {
    return [...pacientesNavegacao].sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
    });
  }, [pacientesNavegacao, sortOrder]);

  // Função para formatar o valor monetário
  const formatPrice = (price) => {
    if (!price) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <S.Container>
      <S.Header>
        <h1>Navegação de Pacientes</h1>
        <p>Monitore o status das avaliações oncológicas diretas e priorize os atendimentos de alto custo.</p>
      </S.Header>

      <S.Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Contato</th>
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
          {sortedPacientes.map(paciente => {
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
                <td>{nomeOperadora}</td>
                
                {/* Coluna Atualizada: Nome do Medicamento e Preço */}
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
        </tbody>
      </S.Table>

      <TermoModal
        isOpen={termoModalOpen}
        onClose={() => setTermoModalOpen(false)}
        paciente={pacienteParaTermo}
        onSuccess={(pacienteAtualizado) => {
          load();
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