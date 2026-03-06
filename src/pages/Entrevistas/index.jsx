import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { LuSignature, LuSearch, LuEye, LuX } from "react-icons/lu";
import { Container, Header, ContentBox, Table, ActionButton, ModalOverlay, ModalContainer, ModalHeader, FormGroup } from './styles';

import EntrevistaForm from './components/EntrevistaForm';
import EntrevistaDetailsModal from './components/EntrevistaDetailsModal';

export default function EntrevistasPage() {
  const [pacientes, setPacientes] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);
  const [medicos, setMedicos] = useState([]); 
  const [tentativas, setTentativas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [viewModalData, setViewModalData] = useState(null);
  const [filter, setFilter] = useState('');

  const [showContactModal, setShowContactModal] = useState(false);
  const [pacienteEmContato, setPacienteEmContato] = useState(null);
  const [contatoBemSucedido, setContatoBemSucedido] = useState(null);
  
  const [medicoSelecionado, setMedicoSelecionado] = useState(''); 
  const [loadingContato, setLoadingContato] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resPacientes, resEntrevistas, resMedicos, resTentativas] = await Promise.all([
        api.get('/pacientes', { params: { is_active: true } }),
        api.get('/entrevistas-medicas'),
        api.get('/medicos'),
        api.get('/tentativas-contato')
      ]);
      setPacientes(resPacientes.data);
      setEntrevistas(resEntrevistas.data);
      setMedicos(resMedicos.data);
      setTentativas(resTentativas.data || []);
    } catch (err) {
      toast.error("Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(p =>
    p.nome.toLowerCase().includes(filter.toLowerCase()) || p.cpf.includes(filter)
  );

  const handleViewDetails = (pacienteId) => {
    const entrevistaDoPaciente = entrevistas.find(e => e.paciente_id === pacienteId);
    if (entrevistaDoPaciente) {
      setViewModalData(entrevistaDoPaciente);
    } else {
      toast.info("A entrevista ainda não foi processada pelo sistema.");
    }
  };

  const openContactModal = (paciente) => {
    setPacienteEmContato(paciente);
    setContatoBemSucedido(null);
    setMedicoSelecionado('');
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setPacienteEmContato(null);
  };

  const handleConfirmarContato = async () => {
    if (!medicoSelecionado) {
      toast.warning("Selecione o médico responsável pelo contato.");
      return;
    }

    setLoadingContato(true);
    try {
      // ---> Agora envia para a API em ambos os casos (True ou False)
      await api.post('/tentativas-contato', {
        paciente_id: pacienteEmContato.id,
        medico_id: medicoSelecionado,
        sucesso: contatoBemSucedido // Envia o booleano de sucesso ou falha
      });

      // Feedback visual dependendo do resultado
      if (contatoBemSucedido) {
        toast.success("Contato bem-sucedido registrado!");
      } else {
        toast.success("Falha no contato registrada para os indicadores.");
      }
      
      // Abre o formulário passando o médico, independente se foi sucesso ou falha
      setSelectedPaciente({ 
        ...pacienteEmContato, 
        medico_pre_selecionado: medicoSelecionado 
      });

      closeContactModal();
      loadData(); // Atualiza para puxar a nova tentativa
    } catch (err) {
      toast.error("Erro ao registrar a tentativa de contato.");
    } finally {
      setLoadingContato(false);
    }
  };

  if (selectedPaciente) {
    return (
      <EntrevistaForm
        paciente={selectedPaciente}
        onCancel={() => setSelectedPaciente(null)}
        onSuccess={() => {
          setSelectedPaciente(null);
          loadData();
        }}
      />
    );
  }

  return (
    <Container>
      <Header>
        <h1>Entrevistas Médicas</h1>
        <div style={{ display: 'flex', background: '#fff', padding: '5px 15px', borderRadius: '4px', border: '1px solid #ddd', alignItems: 'center' }}>
          <LuSearch size={20} color="#ccc" />
          <input
            placeholder="Filtrar por nome ou CPF..."
            style={{ border: 'none', padding: '10px', outline: 'none', width: '300px' }}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </Header>

      <ContentBox>
        <p>Selecione um paciente para iniciar ou visualizar o acompanhamento médico:</p>
        <Table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>CPF</th>
              <th>Cidade</th>
              <th>Operadora</th>
              <th style={{ textAlign: 'center' }}>Tentativas Falhas</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Carregando pacientes...</td></tr>
            ) : filteredPacientes.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhum paciente encontrado.</td></tr>
            ) : (
              filteredPacientes.map(p => {
                const falhas = tentativas.filter(t => t.paciente_id === p.id && t.sucesso === false).length;

                return (
                  <tr key={p.id}>
                    <td><strong>{p.nome} {p.sobrenome}</strong></td>
                    <td>{p.cpf}</td>
                    <td>{p.cidade} - {p.estado}</td>
                    <td>{p.operadoras?.nome}</td>
                    
                    <td style={{ textAlign: 'center' }}>
                      {falhas > 0 ? (
                        <span style={{ backgroundColor: '#fee2e2', color: '#dc3545', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}>
                          {falhas}
                        </span>
                      ) : (
                        <span style={{ color: '#6c757d' }}>0</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {p.fez_entrevista ? (
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <ActionButton disabled>
                            <LuSignature size={18} style={{ marginRight: '8px' }} />
                            Entrevista Realizada
                          </ActionButton>
                          <ActionButton onClick={() => handleViewDetails(p.id)} style={{ backgroundColor: '#17a2b8', color: '#fff' }}>
                            <LuEye size={18} style={{ marginRight: '8px' }} />
                            Ver Detalhes
                          </ActionButton>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <ActionButton onClick={() => openContactModal(p)}>
                            <LuSignature size={18} style={{ marginRight: '8px' }} />
                            Iniciar Entrevista
                          </ActionButton>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </ContentBox>

      {showContactModal && (
        <ModalOverlay>
          <ModalContainer style={{ maxWidth: '500px' }}>
            <ModalHeader>
              <h2>Registro de Contato</h2>
              <button onClick={closeContactModal}><LuX size={24} /></button>
            </ModalHeader>
            
            <div className='div-container' >
              <p>O contato com o médico responsável pelo paciente <strong>{pacienteEmContato?.nome}</strong> foi bem-sucedido para iniciar a entrevista?</p>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <ActionButton 
                  type="button" 
                  onClick={() => setContatoBemSucedido(true)}
                  style={{ flex: 1, justifyContent: 'center', backgroundColor: contatoBemSucedido === true ? '#28a745' : '#f4f6f8', color: contatoBemSucedido === true ? '#fff' : '#333' }}
                >
                  Sim, iniciar entrevista
                </ActionButton>
                <ActionButton 
                  type="button" 
                  onClick={() => setContatoBemSucedido(false)}
                  style={{ flex: 1, justifyContent: 'center', backgroundColor: contatoBemSucedido === false ? '#dc3545' : '#f4f6f8', color: contatoBemSucedido === false ? '#fff' : '#333' }}
                >
                  Não, Iniciar sem os dados do medico
                </ActionButton>
              </div>

              {contatoBemSucedido !== null && (
                <FormGroup style={{ marginTop: '15px' }}>
                  <label>Selecione o médico responsável pelo contato:</label>
                  <select 
                    value={medicoSelecionado} 
                    onChange={e => setMedicoSelecionado(e.target.value)}
                    required
                  >
                    <option value="">Selecione o Médico...</option>
                    {medicos.map(m => <option key={m.id} value={m.id}>{m.nome} (CRM: {m.crm})</option>)}
                  </select>
                </FormGroup>
              )}

              {contatoBemSucedido !== null && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <ActionButton 
                    onClick={handleConfirmarContato} 
                    className="save" 
                    disabled={loadingContato}
                  >
                    {loadingContato ? 'Salvando...' : 'Confirmar'}
                  </ActionButton>
                </div>
              )}
            </div>
          </ModalContainer>
        </ModalOverlay>
      )}

      {viewModalData && (
        <EntrevistaDetailsModal data={viewModalData} onClose={() => setViewModalData(null)} />
      )}
    </Container>
  );
}