import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import TermosChart from './components/TermosChart';
import AdesaoScoreChart from './components/AdesaoScoreChart';
import AderenciaOpcoesChart from './components/AderenciaOpcoesChart';
import FichaRamChart from './components/FichaRamChart';

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
            <option value="termos">Status dos Termos</option>
            <option value="aderencia_categoria">Aderência por Categoria</option>
            <option value="adesao_score">Adesão (Score Questionário)</option>
            <option value="aderencia_opcoes">Aderência (Opções Monitoramento)</option>
            <option value="ficha_ram">Fichas RAM (Eventos Adversos)</option>
          </select>
        </SelectGroup>
      </ControlsPanel>

      <Grid>
        {(graficoSelecionado === 'todos' || graficoSelecionado === 'termos') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <TermosChart chartData={data.termos.chart} reportData={data.termos.report} />
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