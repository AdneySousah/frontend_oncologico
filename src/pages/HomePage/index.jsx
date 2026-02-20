import React from "react";
import * as S from "./styles";



export default function Home() {
  return (

    <div style={{display: 'flex'}}>
      <S.Container>
        <S.Header>
          <h1>Painel de Controle Clínico</h1>
          <p>Visão geral da navegação de pacientes e monitoramento oncológico.</p>
        </S.Header>

        {/* Dashboard Cards */}
        <S.StatsGrid>
          <S.Card>
            <h3>Pacientes em Navegação</h3>
            <div className="value">142</div>
            <div className="indicator positive">▲ 12 novos este mês</div>
          </S.Card>
          
          <S.Card>
            <h3>Alertas de Telemonitoramento</h3>
            <div className="value" style={{color: '#e74c3c'}}>8</div>
            <div className="indicator negative">Requerem atenção imediata</div>
          </S.Card>

          <S.Card>
            <h3>Aderência ao Tratamento</h3>
            <div className="value">94%</div>
            <div className="indicator positive">Dentro da meta esperada</div>
          </S.Card>
          
          <S.Card>
            <h3>Próximas Consultas</h3>
            <div className="value">23</div>
            <div className="indicator">Para hoje</div>
          </S.Card>
        </S.StatsGrid>

        <S.ContentGrid>
          {/* Tabela de Pacientes Prioritários */}
          <S.Section>
            <h2>Prioridades de Navegação (Risco Elevado)</h2>
            <S.Table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Diagnóstico</th>
                  <th>Último Contato</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Maria Aparecida Silva</td>
                  <td>Ca. Mama - Estágio III</td>
                  <td>Há 2 dias</td>
                  <td><span className="status critico">Dor Severa</span></td>
                </tr>
                <tr>
                  <td>João Ferreira</td>
                  <td>Ca. Próstata</td>
                  <td>Ontem</td>
                  <td><span className="status atencao">Efeitos Colaterais</span></td>
                </tr>
                <tr>
                  <td>Ana Clara Souza</td>
                  <td>Leucemia Linfóide</td>
                  <td>Hoje, 09:00</td>
                  <td><span className="status estavel">Monitoramento</span></td>
                </tr>
                <tr>
                  <td>Roberto Mendes</td>
                  <td>Ca. Pulmão</td>
                  <td>Há 5 dias</td>
                  <td><span className="status critico">Sem Resposta</span></td>
                </tr>
              </tbody>
            </S.Table>
          </S.Section>

          {/* Métricas Visuais */}
          <S.Section>
            <h2>Status da Jornada</h2>
            
            <div style={{marginBottom: '20px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'5px'}}>
                <span>Diagnóstico Recente</span>
                <span>25%</span>
              </div>
              <S.ProgressBar percent={25} color="#3498db" />
            </div>

            <div style={{marginBottom: '20px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'5px'}}>
                <span>Em Quimioterapia</span>
                <span>45%</span>
              </div>
              <S.ProgressBar percent={45} color="#9b59b6" />
            </div>

            <div style={{marginBottom: '20px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'5px'}}>
                <span>Radioterapia</span>
                <span>15%</span>
              </div>
              <S.ProgressBar percent={15} color="#e67e22" />
            </div>

            <div style={{marginBottom: '20px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'5px'}}>
                <span>Seguimento</span>
                <span>15%</span>
              </div>
              <S.ProgressBar percent={15} color="#2ecc71" />
            </div>
          </S.Section>
        </S.ContentGrid>
      </S.Container>
    </div>
  );
}