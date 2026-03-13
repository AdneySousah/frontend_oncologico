import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader, ExportButton } from '../styles';

const COLORS = ['#8B5CF6', '#D1D5DB']; // Roxo moderno para Monitorados, Cinza para o resto

const PacientesMonitoradosChart = ({ chartData, reportData, total }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Operadora', key: 'operadora', width: 20 },
      { header: 'Último Monitoramento', key: 'ultimo_monitoramento', width: 25 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Pacientes_Monitorados', 'Pacientes Ativos e Monitorados');
  };

  return (
    <>
      <ChartHeader>
        <h3>Monitorados (Ativos): {total}</h3>
        <ExportButton onClick={handleExport}>📥 Exportar Excel</ExportButton>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie 
            data={chartData} 
            innerRadius={60} 
            outerRadius={100} 
            paddingAngle={5} 
            dataKey="value"
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

export default memo(PacientesMonitoradosChart);