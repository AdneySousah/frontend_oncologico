import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { LuCalculator, LuSearch } from 'react-icons/lu';
import api from '../../services/api';
import * as S from './styles';

// Página "Recálculo" (aba Atendimento): corrige posologia e data de início
// quando foram cadastradas erradas na configuração de uso contínuo — sem
// passar pelo fluxo de "Registrar Contato" do Telemonitoramento. Só lista
// pacientes no PRIMEIRO CICLO de um medicamento (nenhum ciclo anterior,
// concluído ou não, pra esse mesmo par paciente+medicamento); depois do
// primeiro ciclo, qualquer ajuste tem que vir do fluxo normal de contato.
export default function Recalculo() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [posologia, setPosologia] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/monitoramento-medicamentos/recalculaveis', {
        params: debouncedSearch ? { search: debouncedSearch } : {}
      });
      setItens(res.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao buscar monitoramentos recalculáveis.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { carregar(); }, [carregar]);

  const formatarData = (dateStr) => {
    if (!dateStr) return '-';
    return dateStr.split('T')[0].split('-').reverse().join('/');
  };

  const abrirModal = (item) => {
    setItemSelecionado(item);
    setPosologia(item.posologia_diaria || '');
    const dataAtual = item.data_administracao || item.data_entrega;
    setDataInicio(dataAtual ? dataAtual.split('T')[0] : '');
  };

  const fecharModal = () => {
    setItemSelecionado(null);
    setPosologia('');
    setDataInicio('');
  };

  const handleSalvar = async () => {
    if (!posologia || Number(posologia) <= 0) {
      toast.error('Informe uma posologia válida (comprimidos/dia).');
      return;
    }
    if (!dataInicio) {
      toast.error('Informe a data de início.');
      return;
    }

    try {
      setSalvando(true);
      await api.put(`/monitoramento-medicamentos/${itemSelecionado.id}/recalcular`, {
        posologia_diaria: Number(posologia),
        data_administracao: dataInicio
      });
      toast.success('Recálculo aplicado com sucesso.');
      fecharModal();
      carregar();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao aplicar o recálculo.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <S.Container>
      <S.Header>
        <div>
          <h2>Recálculo de Posologia / Data de Início</h2>
          <p>
            Corrige posologia e data de início quando foram cadastradas erradas na configuração de uso contínuo.
            Só aparecem aqui pacientes no <strong>primeiro ciclo</strong> de um medicamento — depois disso, qualquer
            ajuste passa a ser feito pelo fluxo normal de Registrar Contato no Telemonitoramento.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <LuSearch size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          <S.SearchInput
            style={{ paddingLeft: '36px' }}
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </S.Header>

      <S.TableWrapper>
        <S.Table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Medicamento</th>
              <th>Posologia Atual</th>
              <th>Data de Início Atual</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itens.map(item => (
              <tr key={item.id}>
                <td>{item.paciente?.nome} {item.paciente?.sobrenome}</td>
                <td>{item.medicamento?.nome}</td>
                <td>{item.posologia_diaria} cp/dia</td>
                <td>{formatarData(item.data_administracao || item.data_entrega)}</td>
                <td>
                  <S.ActionButton onClick={() => abrirModal(item)}>
                    <LuCalculator size={14} />
                    Recalcular
                  </S.ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </S.Table>
      </S.TableWrapper>

      {!loading && itens.length === 0 && (
        <S.EmptyState>Nenhum paciente elegível para recálculo no momento.</S.EmptyState>
      )}
      {loading && <S.EmptyState>Carregando...</S.EmptyState>}

      {itemSelecionado && (
        <S.ModalOverlay>
          <S.ModalContent>
            <h3>Recalcular Ciclo</h3>
            <p style={{ opacity: 0.75, fontSize: '0.85rem', marginBottom: '18px' }}>
              {itemSelecionado.paciente?.nome} {itemSelecionado.paciente?.sobrenome} — {itemSelecionado.medicamento?.nome}
            </p>

            <S.FormGroup>
              <label>Posologia (comprimidos/dia)</label>
              <S.Input
                type="number"
                min="1"
                value={posologia}
                onChange={(e) => setPosologia(e.target.value)}
              />
            </S.FormGroup>

            <S.FormGroup>
              <label>Data de Início</label>
              <S.Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
              <span className="hint">A data de fim de caixa e a data do próximo contato serão recalculadas a partir daqui.</span>
            </S.FormGroup>

            <S.ButtonGroup>
              <S.Button type="button" variant="secondary" onClick={fecharModal} disabled={salvando}>
                Cancelar
              </S.Button>
              <S.Button type="button" onClick={handleSalvar} disabled={salvando}>
                {salvando ? 'Aplicando...' : 'Aplicar Recálculo'}
              </S.Button>
            </S.ButtonGroup>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
}
