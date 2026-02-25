import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

import AdesaoChart from './components/AdesaoChart';
import ContatoChart from './components/ContatoChart';
import CidChart from './components/CidChart';
import ReacoesChart from './components/ReacoesChart';
import RiscoChart from './components/RiscoChart';

import { Container, Title, Grid, Card, ControlsPanel, FilterGroup, SelectGroup } from './styles';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para Filtros e Seleção
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [graficoSelecionado, setGraficoSelecionado] = useState('todos');

  // Função isolada para poder ser chamada pelo botão de filtrar
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
  }, []); // Carrega vazio na primeira vez

  if (loading && !data) return <Container><h2>Carregando Dashboard...</h2></Container>;
  if (!data) return null;

  return (
    <Container>
      <Title>Visão Geral - Monitoramento</Title>

      {/* Painel de Controles: Filtros de Data e Seleção de Gráfico */}
      <ControlsPanel>
        <FilterGroup>
          <label>Data Início:</label>
          <input 
            type="date" 
            value={dataInicio} 
            onChange={(e) => setDataInicio(e.target.value)} 
          />
          <label>Data Fim:</label>
          <input 
            type="date" 
            value={dataFim} 
            onChange={(e) => setDataFim(e.target.value)} 
          />
          <button onClick={loadDashboard}>
            {loading ? 'Filtrando...' : 'Filtrar'}
          </button>
        </FilterGroup>

        <SelectGroup>
          <label>Visualizar Gráfico:</label>
          <select 
            value={graficoSelecionado} 
            onChange={(e) => setGraficoSelecionado(e.target.value)}
          >
            <option value="todos">Ver Todos</option>
            <option value="adesao">Adesão ao Tratamento</option>
            <option value="contato">Taxa de Contato Efetivo</option>
            <option value="risco">Perfil de Risco (Score)</option>
            <option value="cid">Preenchimento de CID</option>
            <option value="reacoes">Eventos Adversos (Reações)</option>
          </select>
        </SelectGroup>
      </ControlsPanel>

      <Grid>
        {(graficoSelecionado === 'todos' || graficoSelecionado === 'adesao') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <h3>Adesão ao Tratamento</h3>
            <AdesaoChart data={data.adesao} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'contato') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <h3>Taxa de Contato Efetivo</h3>
            <ContatoChart data={data.contato} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'risco') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <h3>Perfil de Risco (Score)</h3>
            <RiscoChart data={data.perfilRisco} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'cid') && (
          <Card $isFullWidth={graficoSelecionado !== 'todos'}>
            <h3>Preenchimento de CID (Entrevistas)</h3>
            <CidChart data={data.cid} />
          </Card>
        )}

        {(graficoSelecionado === 'todos' || graficoSelecionado === 'reacoes') && (
          <Card style={{ gridColumn: graficoSelecionado === 'todos' ? '1 / -1' : 'auto' }}>
            <h3>Principais Eventos Adversos Relatados</h3>
            <ReacoesChart data={data.reacoes} />
          </Card>
        )}
      </Grid>
    </Container>
  );
}