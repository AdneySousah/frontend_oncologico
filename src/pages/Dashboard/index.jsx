import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import AdesaoScoreChart from './components/AdesaoScoreChart';
import AderenciaOpcoesChart from './components/AderenciaOpcoesChart';
import FichaRamChart from './components/FichaRamChart';
import TotalPacientesChart from './components/TotalPacientesChart';
import PacientesMonitoradosChart from './components/PacientesMonitoradosChart';
import PacientesElegiveisChart from './components/PacientesElegiveisChart';
// IMPORT NOVO
import NpsChart from './components/NpsChart';

import { Container, Title, Grid, Card, ControlsPanel, FilterGroup, SelectGroup } from './styles';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('todos');

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
            {/* NOVO OPTION DO NPS ADICIONADO AQUI */}
            <option value="nps">NPS - Índice de Satisfação</option>
            <option value="total_pacientes">Total de Pacientes</option>
            <option value="pacientes_monitorados">Pacientes Monitorados</option>
            <option value="pacientes_elegiveis">Pacientes Elegíveis</option>
            <option value="termos">Status dos Termos</option>
            <option value="adesao_score">Adesão (Score Questionário)</option>
            <option value="aderencia_opcoes">Aderência (Opções Monitoramento)</option>
            <option value="ficha_ram">Fichas RAM (Eventos Adversos)</option>
          </select>
        </SelectGroup>
      </ControlsPanel>

      <Grid>
        {/* COMPONENTE DO NPS NO TOPO */}
        {(graficoSelecionado === 'todos' || graficoSelecionado === 'nps') && data.nps && (
          <Card $isFullWidth={true}>
            <NpsChart 
              chartData={data.nps?.chart || []} 
              reportData={data.nps?.report || []} 
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'total_pacientes') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <TotalPacientesChart 
              chartData={data.totalPacientes.chart} 
              reportData={data.totalPacientes.report} 
              total={data.totalPacientes.total} 
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'pacientes_monitorados') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <PacientesMonitoradosChart 
              chartData={data.pacientesMonitorados.chart} 
              reportData={data.pacientesMonitorados.report} 
              total={data.pacientesMonitorados.total} 
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'pacientes_elegiveis') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <PacientesElegiveisChart 
              chartData={data.pacientesElegiveis.chart} 
              reportData={data.pacientesElegiveis.report} 
              total={data.pacientesElegiveis.total} 
            />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'adesao_score') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <AdesaoScoreChart chartData={data.adesaoScore.chart} reportData={data.adesaoScore.report} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'aderencia_opcoes') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <AderenciaOpcoesChart chartData={data.aderenciaOpcoes.chart} reportData={data.aderenciaOpcoes.report} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'ficha_ram') && (
          <Card style={{ gridColumn: graficoSelecionado === 'todos' ? '1 / -1' : 'auto' }}>
            <FichaRamChart chartData={data.fichaRam.chart} reportData={data.fichaRam.report} />
          </Card>
        )}
      </Grid>
    </Container>
  );
}