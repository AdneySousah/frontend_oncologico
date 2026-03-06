import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader, ExportButton } from '../styles';

// Cores mais modernas e vibrantes
const COLORS = ['#10B981', '#F59E0B', '#EF4444']; 

const TermosChart = ({ chartData, reportData }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Status Termo', key: 'status_termo', width: 20 },
      { header: 'Data Registro', key: 'data_registro', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Termos', 'Status de Aceite dos Termos');
  };

  return (
    <>
      <ChartHeader>
        <h3>Status dos Termos</h3>
        <ExportButton onClick={handleExport}>📥 Exportar Excel</ExportButton>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie 
            data={chartData} 
            innerRadius={70} 
            outerRadius={100} 
            paddingAngle={5} 
            dataKey="value"
            stroke="none" // Remove a borda feia nas fatias
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

export default memo(TermosChart);