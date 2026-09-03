import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { LuPlus, LuPencil, LuPower } from 'react-icons/lu';
import api from '../../services/api';
import {
  Container,
  Header,
  Table,
  StatusBadge,
  ActionButton,
  ModalOverlay,
  ModalContent,
  FormGroup,
  Input,
  ButtonGroup,
  Button
} from './styles';

// Motivos compartilhados entre "Pausar Tratamento" (Necessidade de Navegação)
// e "Descontinuar Medicamento" (Telemonitoramento) — mesma lista nos dois
// fluxos, pra manter os motivos contabilizados de forma consistente.
export default function MotivosPausaTratamento() {
  const [motivos, setMotivos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Controle do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [descricao, setDescricao] = useState('');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    fetchMotivos();
  }, []);

  const fetchMotivos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/motivos-pausa-tratamento?all=true');
      setMotivos(response.data);
    } catch (error) {
      toast.error('Erro ao buscar a lista de motivos.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (motivo = null) => {
    if (motivo) {
      setEditingId(motivo.id);
      setDescricao(motivo.descricao);
      setAtivo(motivo.ativo);
    } else {
      setEditingId(null);
      setDescricao('');
      setAtivo(true);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDescricao('');
    setAtivo(true);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descricao.trim()) {
      toast.error('A descrição é obrigatória.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        descricao: descricao.trim(),
        ativo
      };

      if (editingId) {
        await api.put(`/motivos-pausa-tratamento/${editingId}`, payload);
        toast.success('Motivo atualizado com sucesso!');
      } else {
        await api.post('/motivos-pausa-tratamento', payload);
        toast.success('Novo motivo cadastrado com sucesso!');
      }

      fetchMotivos();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar o motivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtivo = async (id, statusAtual) => {
    try {
      setLoading(true);
      await api.put(`/motivos-pausa-tratamento/${id}`, { ativo: !statusAtual });
      toast.success(`Motivo ${!statusAtual ? 'ativado' : 'inativado'} com sucesso!`);
      fetchMotivos();
    } catch (error) {
      toast.error('Erro ao alterar status do motivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h2>Gerenciar Motivos de Pausa / Descontinuação de Tratamento</h2>
        <Button type="button" onClick={() => handleOpenModal()}>
          <LuPlus size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Novo Motivo
        </Button>
      </Header>

      <p style={{ opacity: 0.75, marginTop: '-10px', marginBottom: '20px', fontSize: '0.9rem' }}>
        Estes motivos aparecem tanto ao pausar o tratamento de um paciente (Necessidade de Navegação)
        quanto ao descontinuar um medicamento (Telemonitoramento) — usar a mesma lista nos dois fluxos
        mantém os motivos contabilizáveis de forma consistente.
      </p>

      {loading && motivos.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {motivos.length > 0 ? (
              motivos.map(motivo => (
                <tr key={motivo.id}>
                  <td>{motivo.id}</td>
                  <td>{motivo.descricao}</td>
                  <td>
                    <StatusBadge ativo={motivo.ativo}>
                      {motivo.ativo ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionButton onClick={() => handleOpenModal(motivo)}>
                        <LuPencil size={16} />
                        Editar
                      </ActionButton>
                      <ActionButton
                        danger={motivo.ativo}
                        onClick={() => handleToggleAtivo(motivo.id, motivo.ativo)}
                      >
                        <LuPower size={16} />
                        {motivo.ativo ? 'Inativar' : 'Ativar'}
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  Nenhum motivo cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      {modalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>{editingId ? 'Editar Motivo' : 'Novo Motivo'}</h3>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Descrição do Motivo</label>
                <Input
                  type="text"
                  placeholder="Ex: Internação hospitalar"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="statusAtivo"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="statusAtivo" style={{ margin: 0, cursor: 'pointer' }}>
                  Motivo está ativo para uso?
                </label>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={handleCloseModal} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </ButtonGroup>
            </form>

          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
