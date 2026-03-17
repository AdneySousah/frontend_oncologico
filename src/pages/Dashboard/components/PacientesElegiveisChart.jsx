import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader } from '../styles';
import ButtonExcelExport from '../../../components/Buttons/ExportButtons';

const COLORS = ['#10B981', '#E5E7EB']; // Verde sucesso para Elegíveis, Cinza claro para não elegíveis

const PacientesElegiveisChart = ({ chartData, reportData, total }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Operadora', key: 'operadora', width: 20 },
      { header: 'Status', key: 'status_elegibilidade', width: 30 },
      { header: 'Data Registro', key: 'data_registro', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Pacientes_Elegiveis', 'Pacientes Elegíveis (Termo Aceito)');
  };

  return (
    <>
      <ChartHeader>
        <h3>Pacientes Elegíveis: {total}</h3>
        <ButtonExcelExport onExport={handleExport} />
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

export default memo(PacientesElegiveisChart);