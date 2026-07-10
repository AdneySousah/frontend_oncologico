import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader } from '../styles';
import ButtonExcelExport from '../../../components/Buttons/ExportButtons';

const FichaRamChart = ({ chartData, reportData }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Reação Adversa', key: 'reacao_adversa', width: 40 },
      { header: 'Data Registro', key: 'data_registro', width: 20 },
      { header: 'Operadora', key: 'operadora', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Fichas_RAM', 'Fichas RAM - Pacientes por Reação');
  };

  return (
    <>
      <ChartHeader>
        <h3>Pacientes por Ficha RAM (Top 10)</h3>
        <ButtonExcelExport onExport={handleExport} />
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
            fill="#F43F5E" 
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
          >
            <LabelList dataKey="value" position="top" fill="#374151" fontSize={16} fontWeight="900" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default memo(FichaRamChart);