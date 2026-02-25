import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

const ContatoChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300} debounce={50}>
      <PieChart>
        <Pie 
          data={data} 
          outerRadius={100} 
          fill="#8884d8" 
          dataKey="value" 
          label
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default memo(ContatoChart);