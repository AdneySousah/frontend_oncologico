import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader } from '../styles';
import ButtonExcelExport from '../../../components/Buttons/ExportButtons';

const AderenciaOpcoesChart = ({ chartData, reportData }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Nível Adesão', key: 'nivel_adesao_informado', width: 25 },
      { header: 'Data Monitoramento', key: 'data_monitoramento', width: 20 },
      { header: 'Operadora', key: 'operadora', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Aderencia_Opcoes', 'Nível de Aderência Declarado');
  };

  return (
    <>
      <ChartHeader>
        <h3>% Aderência (Monitoramento)</h3>
        {/* SVG aplicado e title adicionado para acessibilidade */}
        <ButtonExcelExport onExport={handleExport} />
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* vertical={false} remove a grade vertical e strokeOpacity deixa sutil */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} stroke="#888" />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // Hover da barra sutil
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          />
          <Bar 
            dataKey="value" 
            fill="#6366F1" // Azul Indigo moderno
            radius={[6, 6, 0, 0]} // Cantos superiores arredondados
            maxBarSize={60} // Evita barras gigantes se tiver 1 dado só
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default memo(AderenciaOpcoesChart);