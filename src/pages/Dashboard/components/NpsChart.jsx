import React, { memo } from 'react';
import { PieChart, Pie, Cell } from 'recharts'; // Removemos o ResponsiveContainer
import { useTheme } from 'styled-components'; // Importamos para pegar a cor da agulha dinamicamente
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader } from '../styles';
import ButtonExcelExport from '../../../components/Buttons/ExportButtons';
import { 
  NpsContainer, TopSection, GaugeWrapper, StatsWrapper, 
  StatRow, BigScoreCard, BottomSection, NoteCard 
} from './NpsChartStyles';

const COLORS = {
  detractor: '#e63946', // Vermelho
  neutral: '#f4a261',   // Amarelo
  promoter: '#2a9d8f'   // Verde
};

// Dados base para pintar o arco do velocímetro (3 partes iguais)
const GAUGE_DATA = [
  { name: 'Detratores', value: 33.33, color: COLORS.detractor },
  { name: 'Neutros', value: 33.33, color: COLORS.neutral },
  { name: 'Promotores', value: 33.33, color: COLORS.promoter },
];

const RADIAN = Math.PI / 180;

const NpsChart = ({ chartData = [], reportData = [] }) => {
  const theme = useTheme();
  
  // Define a cor da agulha e do texto com base no tema (claro no dark mode, escuro no light mode)
  const needleColor = theme.colors?.text || '#333'; 

  // 1. Processamento dos Dados
  const totalRespostas = chartData.length;
  
  const notasCount = Array(11).fill(0);
  chartData.forEach(item => {
    if (item.nota >= 0 && item.nota <= 10) notasCount[item.nota]++;
  });

  const detratores = notasCount.slice(0, 7).reduce((a, b) => a + b, 0); 
  const neutros = notasCount.slice(7, 9).reduce((a, b) => a + b, 0);    
  const promotores = notasCount.slice(9, 11).reduce((a, b) => a + b, 0); 

  const percDetratores = totalRespostas ? ((detratores / totalRespostas) * 100) : 0;
  const percNeutros = totalRespostas ? ((neutros / totalRespostas) * 100) : 0;
  const percPromotores = totalRespostas ? ((promotores / totalRespostas) * 100) : 0;

  const npsScore = totalRespostas ? Math.round(percPromotores - percDetratores) : 0;

  let mainColor = COLORS.detractor;
  if (npsScore >= 75) mainColor = COLORS.promoter;
  else if (npsScore >= 0) mainColor = COLORS.neutral;

  // 2. Função para desenhar a agulha do velocímetro no Recharts
  const needle = (value, cx, cy, iR, oR, color) => {
    const total = 200; 
    const normalizedValue = value + 100; 
    
    const ang = 180.0 * (1 - normalizedValue / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 8;
    const x0 = cx;
    const y0 = cy;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return (
      <g>
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} />
      </g>
    );
  };

  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nota', key: 'nota', width: 15 },
      { header: 'Data da Resposta', key: 'created_at', width: 20 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_NPS', 'Respostas do NPS');
  };

  return (
    <NpsContainer>
      <ChartHeader>
        <h3>Índice de Satisfação dos Usuários - NPS</h3>
        <ButtonExcelExport onExport={handleExport} />
      </ChartHeader>

      <TopSection>
        {/* Lado Esquerdo: Velocímetro */}
        <GaugeWrapper>
          {/* Fixamos o tamanho em 340x200 para garantir que o centro matemático nunca descole do centro do desenho */}
          <PieChart width={340} height={200}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={GAUGE_DATA}
              cx={170} // Metade de 340
              cy={160} // Base do arco
              innerRadius={80}
              outerRadius={120}
              stroke="none"
            >
              {GAUGE_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {totalRespostas > 0 && needle(npsScore, 170, 160, 80, 120, needleColor)}
          </PieChart>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '260px', marginTop: '-30px', fontWeight: 'bold', color: '#888' }}>
            <span>-100</span>
            <span style={{ color: needleColor, fontSize: '1.4rem' }}>{npsScore}</span>
            <span>100</span>
          </div>
        </GaugeWrapper>

        {/* Lado Direito: Barras de Detratores/Neutros/Promotores e Score Geral */}
        <StatsWrapper>
          <StatRow color={COLORS.detractor}>
            <div className="badge">{detratores}</div>
            <div className="label">Detratores</div>
            <div className="perc">{percDetratores.toFixed(2)}%</div>
          </StatRow>
          <StatRow color={COLORS.neutral}>
            <div className="badge">{neutros}</div>
            <div className="label">Neutros</div>
            <div className="perc">{percNeutros.toFixed(2)}%</div>
          </StatRow>
          <StatRow color={COLORS.promoter}>
            <div className="badge">{promotores}</div>
            <div className="label">Promotores</div>
            <div className="perc">{percPromotores.toFixed(2)}%</div>
          </StatRow>

          <BigScoreCard color={mainColor}>
            <div className="circle">
              <span>{npsScore}</span>
              <span>NPS</span>
            </div>
          </BigScoreCard>
        </StatsWrapper>
      </TopSection>

      {/* Seção Inferior: Caixinhas das Notas 0 a 10 */}
      <BottomSection>
        {notasCount.map((count, nota) => {
          let color = COLORS.detractor;
          if (nota >= 9) color = COLORS.promoter;
          else if (nota >= 7) color = COLORS.neutral;

          const perc = totalRespostas ? ((count / totalRespostas) * 100).toFixed(2) : 0;

          return (
            <NoteCard key={nota} color={color}>
              <span className="title">Nota {nota}</span>
              <span className="count">{count}</span>
              <span className="perc">{perc}%</span>
            </NoteCard>
          );
        })}
      </BottomSection>
    </NpsContainer>
  );
};

export default memo(NpsChart);