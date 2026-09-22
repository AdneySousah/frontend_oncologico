import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader } from '../styles';
import ButtonExcelExport from '../../../components/Buttons/ExportButtons';

// 👇 CORREÇÃO DE BUG: antes as cores eram escolhidas pela POSIÇÃO no array
// (COLORS[index % COLORS.length]) — funcionava enquanto eram sempre 3
// categorias, mas quando "Não Enviado" virou a 4ª categoria, o índice 3
// "dava a volta" (3 % 3 = 0) e reusava a MESMA cor de "Aceito" (índice 0),
// deixando os dois com verde idêntico no gráfico. Mapear por NOME em vez
// de posição evita esse tipo de colisão se a ordem ou a quantidade de
// categorias mudar de novo no futuro.
const CORES_POR_STATUS = {
  'Aceito': '#10B981',      // verde
  'Pendente': '#F59E0B',    // laranja
  'Recusado': '#EF4444',    // vermelho
  'Não Enviado': '#9CA3AF', // cinza neutro
  'Cancelado': '#6B7280',   // cinza mais escuro
};
const COR_PADRAO = '#94A3B8'; // qualquer categoria futura não mapeada

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#FFFFFF" 
      textAnchor="middle" 
      dominantBaseline="central" 
      fontSize={18} 
      fontWeight="bold" 
      style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }} 
    >
      {value > 0 ? value : ''}
    </text>
  );
};

const TermosChart = ({ chartData, reportData }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Status Termo', key: 'status_termo', width: 20 },
      { header: 'Data Registro', key: 'data_registro', width: 20 },
      { header: 'Operadora', key: 'operadora', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Termos', 'Status de Aceite dos Termos');
  };

  return (
    <>
      <ChartHeader>
        <h3>Pacientes Elegíveis </h3>
        <ButtonExcelExport onExport={handleExport} />
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie 
            data={chartData} 
            innerRadius={70} 
            outerRadius={100} 
            paddingAngle={5} 
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CORES_POR_STATUS[entry.name] || COR_PADRAO} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            itemStyle={{ color: '#333' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default memo(TermosChart);