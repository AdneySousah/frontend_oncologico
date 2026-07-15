import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import * as S from './styles';
import { exportToXLSX } from '../../utils/exportExcel';
import { LuDownload, LuFilter } from 'react-icons/lu';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default function ListaFaturamento() {
  const [faturamentoData, setFaturamentoData] = useState([]);
  const [resumo, setResumo] = useState({ total_faturado: 0, total_comissao: 0, qtd_atendimentos: 0 });
  const [loading, setLoading] = useState(false);

  // Novo estado para armazenar as operadoras para o filtro
  const [operadoras, setOperadoras] = useState([]);

  const [filters, setFilters] = useState({
    data_inicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    data_fim: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    search: '',
    operadora_id: '',
    comissao_percentual: 10
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
    ];

    const exportData = faturamentoData.map(item => ({
      ...item,
      data_administracao: formatDate(item.data_administracao),
      preco_unitario: formatCurrency(item.preco_unitario),
      preco_total: formatCurrency(item.preco_total),
      comissao: formatCurrency(item.comissao)
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
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="10" style={{ textAlign: 'center' }}>Carregando...</td></tr>
          ) : faturamentoData.length > 0 ? (
            faturamentoData.map((item, idx) => (
              <tr key={idx}>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                Nenhum faturamento encontrado neste período.
              </td>
            </tr>
          )}
        </tbody>
      </S.Table>
    </S.Container>
  );
}