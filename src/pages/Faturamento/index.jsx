import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import * as S from './styles';
import { exportToXLSX } from '../../utils/exportExcel';
import { LuDownload, LuFilter } from 'react-icons/lu';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function ListaFaturamento() {
  const [faturamentoData, setFaturamentoData] = useState([]);
  const [resumo, setResumo] = useState({ total_faturado: 0, total_comissao: 0, qtd_atendimentos: 0, total_sem_acompanhamento: 0, total_comissao_sem_acompanhamento: 0, qtd_sem_acompanhamento: 0, total_geral: 0, total_comissao_geral: 0 });
  const [loading, setLoading] = useState(false);

  // Novo estado para armazenar as operadoras para o filtro
  const [operadoras, setOperadoras] = useState([]);

  const [filters, setFilters] = useState({
    data_inicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    data_fim: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    search: '',
    operadora_id: '',
    comissao_percentual: 10,
    // 👇 ORIGEM: todos | monitorados (ciclos, como sempre) | sem_acompanhamento (compras processadas sem monitoramento)
    origem: 'todos'
  });

  // Função para buscar as operadoras disponíveis
  const loadOperadoras = async () => {
    try {
      const res = await api.get('/operadoras'); // Ajuste a rota se necessário
      setOperadoras(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar operadoras", error);
    }
  };

  const loadFaturamento = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faturamento', { params: filters });
      setFaturamentoData(res.data.data || []);
      setResumo(res.data.resumo || { total_faturado: 0, total_comissao: 0, qtd_atendimentos: 0 });
    } catch (error) {
      console.error("Erro ao buscar faturamento", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega as operadoras e o faturamento ao montar o componente
  useEffect(() => {
    loadOperadoras();
    loadFaturamento();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  // Substitua sua função formatDate por esta:
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    // Corta qualquer informação de hora (T00:00:00.000Z) e pega só a data
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');

    // Retorna exatamente o que veio do banco
    return `${day}/${month}/${year}`;
  };

  const handleExportExcel = () => {
    const columns = [
      { header: 'Paciente', key: 'paciente', width: 35 },
      { header: 'CPF', key: 'cpf', width: 20 },
      { header: 'Operadora', key: 'operadora', width: 25 },
      { header: 'Código TUSS', key: 'codigo_tuss', width: 15 },
      { header: 'Medicamento', key: 'medicamento', width: 35 },
      { header: 'Fornecedor', key: 'fornecedor', width: 25 },
      { header: 'Data Adm.', key: 'data_administracao', width: 15 },
      { header: 'Qtd.', key: 'quantidade', width: 10 },
      { header: 'Preço Un.', key: 'preco_unitario', width: 20 },
      { header: 'Preço Total', key: 'preco_total', width: 20 },
      { header: 'Comissão', key: 'comissao', width: 20 },
      // 👇 origem da linha: ciclo monitorado ou compra processada sem acompanhamento
      { header: 'Origem', key: 'origem_texto', width: 26 },
      { header: 'Compra (evento)', key: 'evento_externo_id', width: 16 },
      { header: 'Processado em', key: 'processado_em_texto', width: 18 },
      { header: 'Processado por', key: 'processado_por', width: 22 },
      { header: 'Ciclo base', key: 'ciclo_base_id', width: 12 },
      { header: 'Observação', key: 'observacao_processamento', width: 60 },
    ];

    const exportData = faturamentoData.map(item => ({
      ...item,
      data_administracao: formatDate(item.data_administracao),
      preco_unitario: formatCurrency(item.preco_unitario),
      preco_total: formatCurrency(item.preco_total),
      comissao: formatCurrency(item.comissao),
      origem_texto: item.origem === 'SEM_ACOMPANHAMENTO' ? 'Processado sem acompanhamento' : 'Monitorado',
      evento_externo_id: item.evento_externo_id || '',
      processado_em_texto: item.processado_em ? new Date(item.processado_em).toLocaleString('pt-BR') : '',
      processado_por: item.processado_por || '',
      ciclo_base_id: item.ciclo_base_id || '',
      observacao_processamento: item.observacao_processamento || ''
    }));

    const reportTitle = `Faturamento - ${formatDate(filters.data_inicio)} a ${formatDate(filters.data_fim)} (Comissão: ${filters.comissao_percentual}%)`;

    exportToXLSX(exportData, columns, 'Relatorio_Faturamento', reportTitle);
  };

  return (
    <S.Container>
      <S.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Faturamento & Comissões</h1>
          <p>Consolidação financeira mensal de medicamentos por paciente.</p>
        </div>
        <S.ActionButton
          style={{ backgroundColor: '#52c41a', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={handleExportExcel}
          disabled={faturamentoData.length === 0}
        >
          <LuDownload size={18} />
          Exportar XLSX
        </S.ActionButton>
      </S.Header>

      <S.FilterContainer>
        <S.InputGroup>
          <label>Busca de Paciente</label>
          <input
            type="text"
            name="search"
            placeholder="Nome ou CPF"
            value={filters.search}
            onChange={handleChange}
          />
        </S.InputGroup>

        {/* Novo campo de filtro por Operadora */}
        <S.InputGroup>
          <label>Operadora</label>
          <select
            name="operadora_id"
            value={filters.operadora_id}
            onChange={handleChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Todas</option>
            {operadoras.map(op => (
              <option key={op.id} value={op.id}>
                {op.nome}
              </option>
            ))}
          </select>
        </S.InputGroup>

        <S.InputGroup>
          <label>Data Início</label>
          <input
            type="date"
            name="data_inicio"
            value={filters.data_inicio}
            onChange={handleChange}
          />
        </S.InputGroup>

        <S.InputGroup>
          <label>Data Fim</label>
          <input
            type="date"
            name="data_fim"
            value={filters.data_fim}
            onChange={handleChange}
          />
        </S.InputGroup>

        <S.InputGroup>
          <label>Origem</label>
          <select
            name="origem"
            value={filters.origem}
            onChange={handleChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="todos">Todos</option>
            <option value="monitorados">Só monitorados (ciclos)</option>
            <option value="sem_acompanhamento">Só processados sem acompanhamento</option>
          </select>
        </S.InputGroup>
        <S.InputGroup style={{ maxWidth: '120px' }}>
          <label>% Comissão</label>
          <input
            type="number"
            name="comissao_percentual"
            value={filters.comissao_percentual}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </S.InputGroup>

        <S.ActionButton
          style={{ alignSelf: 'flex-end', height: '40px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1890ff' }}
          onClick={loadFaturamento}
        >
          <LuFilter size={16} />
          Filtrar Dados
        </S.ActionButton>
      </S.FilterContainer>

      <S.CountersContainer>
        <S.SummaryCard cor="#1890ff">
          <p>Total Faturado</p>
          <h2>{formatCurrency(resumo.total_faturado)}</h2>
        </S.SummaryCard>

        <S.SummaryCard cor="#52c41a">
          <p>Total Comissão</p>
          <h2>{formatCurrency(resumo.total_comissao)}</h2>
        </S.SummaryCard>

        <S.SummaryCard cor="#faad14" isNumero>
          <p>Qtd. Atendimentos</p>
          <h2>{resumo.qtd_atendimentos}</h2>
        </S.SummaryCard>
        {/* 👇 compras processadas sem acompanhamento: somadas à parte, pra não mexer no número já emitido */}
        <S.SummaryCard cor="#8e44ad">
          <p>Sem acompanhamento ({resumo.qtd_sem_acompanhamento || 0} compra{(resumo.qtd_sem_acompanhamento || 0) === 1 ? '' : 's'})</p>
          <h2>{formatCurrency(resumo.total_sem_acompanhamento || 0)}</h2>
          <small style={{ color: '#8e44ad' }}>Comissão: {formatCurrency(resumo.total_comissao_sem_acompanhamento || 0)}</small>
        </S.SummaryCard>
        <S.SummaryCard cor="#2c3e50">
          <p>Total Geral (monitorados + sem acompanhamento)</p>
          <h2>{formatCurrency(resumo.total_geral ?? resumo.total_faturado)}</h2>
        </S.SummaryCard>
        <S.SummaryCard cor="#2c3e50">
          <p>Comissão Geral (monitorados + sem acompanhamento)</p>
          <h2>{formatCurrency(resumo.total_comissao_geral ?? resumo.total_comissao)}</h2>
        </S.SummaryCard>
      </S.CountersContainer>

      <S.Table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Matricula</th>
            <th>Operadora</th>
            <th>Código TUSS</th>
            <th>Medicamento</th>
            <th>Fornecedor</th>
            <th>Data Adm.</th>
            <th>Qtd.</th>
            <th>Preço Un.</th>
            <th>Total Faturado</th>
            <th>Comissão</th>
            <th>Origem</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="12" style={{ textAlign: 'center' }}>Carregando...</td></tr>
          ) : faturamentoData.length > 0 ? (
            faturamentoData.map((item, idx) => (
              <tr key={idx} style={item.origem === 'SEM_ACOMPANHAMENTO' ? { background: '#f5eef8' } : undefined}>
                <td><strong>{item.paciente}</strong></td>
                <td>{item.matricula}</td>
                <td>{item.operadora}</td>
                <td>{item.codigo_tuss || '-'}</td>
                <td>{item.medicamento}</td>
                <td>{item.fornecedor}</td>
                <td>{formatDate(item.data_administracao)}</td>
                <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                <td>{formatCurrency(item.preco_unitario)}</td>
                <td style={{ color: '#1890ff', fontWeight: 'bold' }}>{formatCurrency(item.preco_total)}</td>
                <td style={{ color: '#52c41a', fontWeight: 'bold' }}>{formatCurrency(item.comissao)}</td>
                <td>
                  {item.origem === 'SEM_ACOMPANHAMENTO' ? (
                    <div
                      style={{ fontSize: '0.8rem', color: '#6c3483' }}
                      title={`Compra #${item.evento_externo_id} confirmada como utilizada sem ciclo de monitoramento.${item.processado_em ? ` Processado em ${new Date(item.processado_em).toLocaleString('pt-BR')}` : ''}${item.processado_por ? ` por ${item.processado_por}` : ''}.${item.ciclo_base_id ? ` Ao iniciar o ciclo #${item.ciclo_base_id}${item.ciclo_base_evento ? ` (compra #${item.ciclo_base_evento})` : ''}.` : ''}${item.observacao_processamento ? ` ${item.observacao_processamento}` : ''}`}
                    >
                      <strong>Sem acompanhamento</strong><br />
                      compra #{item.evento_externo_id}
                      {item.processado_em && <><br />{new Date(item.processado_em).toLocaleDateString('pt-BR')}{item.processado_por ? ` · ${item.processado_por}` : ''}</>}
                      {item.ciclo_base_id && <><br />ao iniciar o ciclo #{item.ciclo_base_id}</>}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#1890ff' }}>Monitorado</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                Nenhum faturamento encontrado neste período.
              </td>
            </tr>
          )}
        </tbody>
      </S.Table>
    </S.Container>
  );
}