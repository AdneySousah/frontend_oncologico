import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import AdesaoScoreChart from './components/AdesaoScoreChart';
import AderenciaOpcoesChart from './components/AderenciaOpcoesChart';
import FichaRamChart from './components/FichaRamChart';
import PacientesAtivosChart from './components/PacientesAtivosChart';
import PacientesMonitoradosChart from './components/PacientesMonitoradosChart';
import NpsChart from './components/NpsChart';
import HistoricoTrocaTable from './components/HistoricoTrocaTable';
import TermosChart from './components/TermosChart';
import ProblemasContatoChart from './components/ProblemasContatoChart'; // <-- NOVO IMPORT

import { Container, Title, Grid, Card, ControlsPanel, FilterGroup, SelectGroup } from './styles';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('todos');

  // 👇 NOVO: status do fechamento do mês anterior + ação de fechar agora
  const [statusMesAnterior, setStatusMesAnterior] = useState(null);
  const [fechandoMes, setFechandoMes] = useState(false);
  const [podeFecharMes, setPodeFecharMes] = useState(false);

  const carregarStatusMesAnterior = async () => {
    try {
      const response = await api.get('/dashboard/status-fechamento-mes-anterior');
      setStatusMesAnterior(response.data);
    } catch (error) {
      // 403 é esperado pra quem não tem a permissão — não é erro de verdade
      if (error.response?.status !== 403) {
        console.error('Erro ao verificar status do mês anterior', error);
      }
    }
  };

  const handleFecharMesAnterior = async () => {
    if (!statusMesAnterior) return;
    const confirmar = window.confirm(
      `Fechar (congelar) o mês ${statusMesAnterior.mes}/${statusMesAnterior.ano} agora? Depois de fechado, os números desse mês não mudam mais, mesmo que dados novos cheguem.`
    );
    if (!confirmar) return;

    try {
      setFechandoMes(true);
      await api.post('/dashboard/fechar-mes-anterior');
      toast.success(`Mês ${statusMesAnterior.mes}/${statusMesAnterior.ano} fechado com sucesso!`);
      await carregarStatusMesAnterior();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao fechar o mês anterior.');
    } finally {
      setFechandoMes(false);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard', {
        params: {
          data_inicio: dataInicio || undefined,
          data_fim: dataFim || undefined
        }
      });
      setData(response.data);
    } catch (error) {
      toast.error('Erro ao carregar indicadores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    // Só busca/exibe o status de fechamento de mês pra quem tem a
    // permissão dedicada "Fechar Mês (Dashboard)" em Perfis — sem isso o
    // botão nem chega a aparecer pra quem não deveria ver.
    api.get('/users/me')
      .then(response => {
        const temPermissao = response.data?.perfil?.permissoes?.fechar_mes_dashboard?.acessar === true;
        setPodeFecharMes(temPermissao);
        if (temPermissao) carregarStatusMesAnterior();
      })
      .catch(err => console.error('Erro ao verificar permissões do usuário', err));
  }, []);

  if (loading && !data) return <Container><h2>Carregando Dashboard...</h2></Container>;
  if (!data) return null;

  return (
    <Container>
      <Title>Visão Geral - Monitoramento Clínico</Title>

      <ControlsPanel>
        <FilterGroup>
          <label>Data Início:</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          <label>Data Fim:</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          <button onClick={loadDashboard}>{loading ? 'Filtrando...' : 'Filtrar'}</button>
        </FilterGroup>

        <SelectGroup>
          <label>Visualizar Gráfico:</label>
          <select value={graficoSelecionado} onChange={(e) => setGraficoSelecionado(e.target.value)}>
            <option value="todos">Ver Todos</option>
            <option value="nps">NPS - Índice de Satisfação</option>
            <option value="pacientes_sincronizados">Total de Pacientes Sincronizados</option>
            <option value="pacientes_monitorados">Pacientes Monitorados</option>
            <option value="termos">Pacientes Elegíveis (Termo aceito)</option>
            <option value="adesao_score">Adesão (Score Questionário)</option>
            <option value="aderencia_opcoes">Aderência (Opções Monitoramento)</option>
            <option value="ficha_ram">Fichas RAM (Eventos Adversos)</option>
            <option value="problemas_contato">Problemas de Contato (Falhas)</option> {/* <-- NOVA OPÇÃO */}
            <option value="troca_medicamentos">Histórico de Troca de Medicamentos</option>
          </select>
        </SelectGroup>

        {statusMesAnterior && (
          statusMesAnterior.fechado ? (
            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              ✅ Mês anterior ({statusMesAnterior.mes}/{statusMesAnterior.ano}) já foi fechado.
            </span>
          ) : (
            <button
              onClick={handleFecharMesAnterior}
              disabled={fechandoMes}
              title="Fecha o mês anterior antes do fechamento automático do dia 3"
              style={{
                padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', fontWeight: 'bold',
                cursor: fechandoMes ? 'not-allowed' : 'pointer', background: '#f0ad4e', color: '#fff',
                opacity: fechandoMes ? 0.6 : 1
              }}
            >
              {fechandoMes ? 'Fechando...' : `Fechar Mês Anterior (${statusMesAnterior.mes}/${statusMesAnterior.ano})`}
            </button>
          )
        )}
      </ControlsPanel>

      <Grid>
        {(graficoSelecionado === 'todos' || graficoSelecionado === 'nps') && data.nps && (
          <Card $isFullWidth={true}>
            <NpsChart
              chartData={data.nps?.chart || []}
              reportData={data.nps?.report || []}
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'pacientes_sincronizados') && data.pacientesSincronizados && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <PacientesAtivosChart
              chartData={data.pacientesSincronizados.chart}
              reportData={data.pacientesSincronizados.report}
              total={data.pacientesSincronizados.total}
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'termos') && data.termos && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <TermosChart
              chartData={data.termos.chart}
              reportData={data.termos.report}
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'adesao_score') && data.adesaoScore && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <AdesaoScoreChart chartData={data.adesaoScore.chart} reportData={data.adesaoScore.report} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'pacientes_monitorados') && data.pacientesMonitorados && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <PacientesMonitoradosChart
              chartData={data.pacientesMonitorados.chart}
              reportData={data.pacientesMonitorados.report}
              total={data.pacientesMonitorados.total}
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'aderencia_opcoes') && data.aderenciaOpcoes && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <AderenciaOpcoesChart chartData={data.aderenciaOpcoes.chart} reportData={data.aderenciaOpcoes.report} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'ficha_ram') && data.fichaRam && (
          <Card style={{ gridColumn: graficoSelecionado === 'todos' ? '1 / -1' : 'auto' }}>
            <FichaRamChart chartData={data.fichaRam.chart} reportData={data.fichaRam.report} />
          </Card>
        )}

        {/* <-- NOVO BLOCO DO GRÁFICO DE PROBLEMAS DE CONTATO --> */}
        {(graficoSelecionado === 'todos' || graficoSelecionado === 'problemas_contato') && data.problemasContato && (
          <Card style={{ gridColumn: graficoSelecionado === 'todos' ? '1 / -1' : 'auto' }}>
            <ProblemasContatoChart chartData={data.problemasContato.chart} reportData={data.problemasContato.report} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'troca_medicamentos') && data.historicoTrocas && (
          <Card style={{ gridColumn: '1 / -1' }}>
            <HistoricoTrocaTable
              tableData={data.historicoTrocas?.table || []}
              reportData={data.historicoTrocas?.report || []}
            />
          </Card>
        )}
      </Grid>
    </Container>
  );
}