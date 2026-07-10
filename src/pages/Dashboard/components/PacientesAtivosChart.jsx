import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader } from '../styles';
import ButtonExcelExport from '../../../components/Buttons/ExportButtons';

const COLORS = ['#3B82F6']; 

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

const PacientesAtivosChart = ({ chartData, reportData, total }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Operadora', key: 'operadora', width: 20 },
      { header: 'Data Registro', key: 'data_registro', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Pacientes_Sincronizados', 'Lista de Pacientes Sincronizados');
  };

  return (
    <>
      <ChartHeader>
        <h3>Total de Pacientes Sincronizados: {total}</h3>
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
            labelLine={false}
            label={renderCustomizedLabel}
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

export default memo(PacientesAtivosChart);