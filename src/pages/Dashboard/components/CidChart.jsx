import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CidChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300} debounce={50}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Bar 
          dataKey="value" 
          fill="#8884d8" 
          barSize={30} 
          isAnimationActive={false} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default memo(CidChart);