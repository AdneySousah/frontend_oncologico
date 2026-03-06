import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader, ExportButton } from '../styles';

const FichaRamChart = ({ chartData, reportData }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Reação Adversa', key: 'reacao_adversa', width: 40 },
      { header: 'Data Registro', key: 'data_registro', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Fichas_RAM', 'Fichas RAM - Pacientes por Reação');
  };

  return (
    <>
      <ChartHeader>
        <h3>Pacientes por Ficha RAM (Top 10)</h3>
        <ExportButton onClick={handleExport}>📥 Exportar Excel</ExportButton>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} stroke="#888" />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 11 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          />
          <Bar 
            dataKey="value" 
            fill="#F43F5E" // Rose moderno
            radius={[6, 6, 0, 0]} 
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default memo(FichaRamChart);