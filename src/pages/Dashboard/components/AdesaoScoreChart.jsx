import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader, ExportButton } from '../styles';

const COLORS = ['#6df512', '#f3df2a', '#f30c0c']; // Azul, Roxo, Rosa

const AdesaoScoreChart = ({ chartData, reportData }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Score Total', key: 'score_total', width: 15 },
      { header: 'Nível Classificado', key: 'nivel_classificado', width: 25 },
      { header: 'Data Avaliação', key: 'data_avaliacao', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Adesao_Score', 'Nível de Adesão (Questionário)');
  };

  return (
    <>
      <ChartHeader>
        <h3>% Adesão (Score Questionário)</h3>
        <ExportButton onClick={handleExport}>📥 Exportar Excel</ExportButton>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie 
            data={chartData} 
            outerRadius={100} 
            dataKey="value" 
            labelLine={false} // Remove a linha feia que estava aparecendo
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default memo(AdesaoScoreChart);