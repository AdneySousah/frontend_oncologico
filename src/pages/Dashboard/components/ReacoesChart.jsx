import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReacoesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300} debounce={50}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="value" 
          fill="#FF8042" 
          isAnimationActive={false} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default memo(ReacoesChart);