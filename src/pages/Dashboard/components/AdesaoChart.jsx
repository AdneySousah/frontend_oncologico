import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const AdesaoChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300} debounce={50}>
      <PieChart>
        <Pie 
          data={data} 
          innerRadius={60} 
          outerRadius={100} 
          paddingAngle={5} 
          dataKey="value"
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

export default memo(AdesaoChart);