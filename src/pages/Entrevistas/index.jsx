import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { LuSignature, LuSearch, LuEye } from "react-icons/lu";
import { Container, Header, ContentBox, Table, ActionButton } from './styles';

import EntrevistaForm from './components/EntrevistaForm';
import EntrevistaDetailsModal from './components/EntrevistaDetailsModal';

export default function EntrevistasPage() {
  const [pacientes, setPacientes] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [viewModalData, setViewModalData] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resPacientes, resEntrevistas] = await Promise.all([
        // Passamos o parâmetro is_active: true para trazer SÓ os ativos nesta tela
        api.get('/pacientes', { params: { is_active: true } }),
        api.get('/entrevistas-medicas')
      ]);
      setPacientes(resPacientes.data);
      setEntrevistas(resEntrevistas.data);
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

  if (selectedPaciente) {
    return (
      <EntrevistaForm
        paciente={selectedPaciente}
        onCancel={() => setSelectedPaciente(null)}
        onSuccess={() => {
          setSelectedPaciente(null);
          loadData();
          toast.success("Entrevista salva com sucesso!");
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
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Carregando pacientes...</td></tr>
            ) : filteredPacientes.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Nenhum paciente encontrado.</td></tr>
            ) : (
              filteredPacientes.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome} {p.sobrenome}</strong></td>
                  <td>{p.cpf}</td>
                  <td>{p.cidade} - {p.estado}</td>
                  <td>{p.operadoras.nome}</td>
                  <td style={{ textAlign: 'center' }}>

                    {/* RENDERIZAÇÃO: MANTÉM OS DOIS BOTÕES QUANDO A ENTREVISTA FOI FEITA */}
                    {p.fez_entrevista ? (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <ActionButton disabled>
                          <LuSignature size={18} style={{ marginRight: '8px' }} />
                          Entrevista Realizada
                        </ActionButton>

                        <ActionButton
                          onClick={() => handleViewDetails(p.id)}
                          style={{ backgroundColor: '#17a2b8', color: '#fff' }}
                        >
                          <LuEye size={18} style={{ marginRight: '8px' }} />
                          Ver Detalhes
                        </ActionButton>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ActionButton onClick={() => setSelectedPaciente(p)}>
                          <LuSignature size={18} style={{ marginRight: '8px' }} />
                          Iniciar Entrevista
                        </ActionButton>
                      </div>
                    )}

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </ContentBox>

      {viewModalData && (
        <EntrevistaDetailsModal
          data={viewModalData}
          onClose={() => setViewModalData(null)}
        />
      )}
    </Container>
  );
}