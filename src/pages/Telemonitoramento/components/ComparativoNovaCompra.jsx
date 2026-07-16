import React from 'react';
import styled from 'styled-components';
import { LuTriangleAlert, LuArrowRight, LuPackageCheck, LuCalendarClock } from 'react-icons/lu';
import { FormGroup, Input } from './styles';

const BannerContainer = styled.div`
  background: ${props => props.isChange ? 'rgba(243, 156, 18, 0.12)' : 'rgba(39, 174, 96, 0.12)'};
  border: 1px solid ${props => props.isChange ? '#f39c12' : '#27ae60'};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  color: var(--text-color);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 1.05rem;
  margin-bottom: 10px;
  color: ${props => props.isChange ? '#e67e22' : '#27ae60'};
`;

const GridInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.03);
  padding: 12px;
  border-radius: 6px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ItemBlock = styled.div`
  p { margin: 3px 0; }
  .label { font-weight: 600; opacity: 0.7; }
  .value { font-weight: bold; display: flex; align-items: center; gap: 8px; }
`;

const DetalhamentoBox = styled.div`
  background: ${props => props.hasGap ? 'rgba(241, 196, 15, 0.18)' : 'rgba(255, 255, 255, 0.6)'};
  border: 1px solid ${props => props.hasGap ? '#f1c40f' : 'rgba(0, 0, 0, 0.06)'};
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: 5px;
  transition: all 0.2s ease-in-out;
`;

const AlertMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fff;
  border-left: 4px solid #f1c40f;
  padding: 10px 12px;
  border-radius: 4px;
  margin-top: 12px;
  color: #7f8c8d;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  strong {
    color: #e67e22;
  }
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed rgba(0,0,0,0.1);
  font-weight: bold;
  cursor: pointer;
  font-size: 0.95rem;
  
  input { width: 18px; height: 18px; cursor: pointer; }
`;

export default function ComparativoNovaCompra({ 
  data, 
  checked, 
  onChangeChecked, 
  dataInicioManual, 
  onChangeDataInicio,
  posologiaAtual,
  posologiaNovaCaixa,
  onChangePosologiaNova,
  estoqueHoje,
  dataInicioAtual,
  isAntesDoInicio
}) {
  if (!data) return null;

  const {
    medicamento_atual,
    medicamento_novo,
    mudou_medicamento,
    qtd_caixas,
    data_entrega,
    data_previsao_administracao,
    data_novo_inicio
  } = data;

  let sobraLive = 0;
  let totalEstoqueLive = data.total_capsulas_novas;
  let diasSemMedicacao = 0;

  const estoqueValido = Number(estoqueHoje) || 0;
  const posAtualValida = Number(posologiaAtual) || 1;

  if (dataInicioManual && dataInicioAtual) {
    const dataInicioNovoObj = new Date(dataInicioManual + 'T00:00:00');
    const dataInicioAtualObj = new Date(dataInicioAtual.split('T')[0] + 'T00:00:00');
    const dataHojeObj = new Date();
    dataHojeObj.setHours(0, 0, 0, 0);

    let dataFimEstimadaObj = new Date();

    if (isAntesDoInicio) {
      const diasAutonomia = estoqueValido / posAtualValida;
      dataFimEstimadaObj = new Date(dataInicioAtualObj.getTime());
      dataFimEstimadaObj.setDate(dataFimEstimadaObj.getDate() + Math.floor(diasAutonomia));
    } else {
      const diasAutonomia = estoqueValido / posAtualValida;
      dataFimEstimadaObj = new Date(dataHojeObj.getTime());
      dataFimEstimadaObj.setDate(dataFimEstimadaObj.getDate() + Math.floor(diasAutonomia));
    }

    const diffDays = (dataInicioNovoObj - dataFimEstimadaObj) / (1000 * 60 * 60 * 24);

    if (diffDays > 0) {
      diasSemMedicacao = Math.floor(diffDays);
      sobraLive = 0;
    } else {
      diasSemMedicacao = 0;
      sobraLive = Math.floor(Math.abs(diffDays) * posAtualValida);
      if (sobraLive > estoqueValido) sobraLive = estoqueValido;
    }
  }

  if (!mudou_medicamento) {
    totalEstoqueLive = data.total_capsulas_novas + sobraLive;
  }

  const formatarDataLocal = (dateStr) => {
    if (!dateStr) return '-';
    return dateStr.split('T')[0].split('-').reverse().join('/');
  };

  return (
    <BannerContainer isChange={mudou_medicamento}>
      <Header isChange={mudou_medicamento}>
        {mudou_medicamento ? <LuTriangleAlert size={22} /> : <LuPackageCheck size={22} />}
        <span>
          {mudou_medicamento 
            ? 'Atenção: Nova Compra com Troca de Medicamento Detectada!' 
            : 'Nova Compra Identificada para o Próximo Ciclo!'}
        </span>
      </Header>

      <p style={{ margin: '0 0 15px 0', fontSize: '0.88rem', opacity: 0.9 }}>
        O sistema externo processou um novo evento de fornecimento. A projeção será ajustada com base nas datas e sobras informadas abaixo.
      </p>

      <GridInfo>
        <ItemBlock>
          <p className="label">Medicamento do Novo Ciclo</p>
          <p className="value">
            {mudou_medicamento ? (
              <>
                <span style={{ color: '#c0392b', textDecoration: 'line-through' }}>{medicamento_atual.nome}</span>
                <LuArrowRight size={16} />
                <span style={{ color: '#27ae60' }}>{medicamento_novo.nome}</span>
              </>
            ) : (
              <span>{medicamento_novo.nome}</span>
            )}
          </p>
        </ItemBlock>

        <ItemBlock>
          <p className="label">Data Prevista Para Entrega</p>
          <p className="value">{formatarDataLocal(data_entrega)}</p>
        </ItemBlock>

        <ItemBlock>
          <p className="label">Previsão de Uso do Medicamento</p>
          <p className="value">{formatarDataLocal(data_previsao_administracao)}</p>
        </ItemBlock>

        <ItemBlock>
          <p className="label">Previsão de uso do medicamento (+5 dias)</p>
          <p className="value" style={{ color: 'var(--primary-color)' }}>
            {formatarDataLocal(data_novo_inicio)}
          </p>
        </ItemBlock>

        <ItemBlock style={{ gridColumn: '1 / -1' }}>
          <p className="label">Detalhamento do Estoque Projetado</p>
          <DetalhamentoBox hasGap={diasSemMedicacao > 0}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.95rem' }}>
              <span>Conteúdo das Novas Caixas ({qtd_caixas} un.)</span>
              <strong>{data.total_capsulas_novas} comp.</strong>
            </div>
            
            {!mudou_medicamento && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.95rem', color: diasSemMedicacao > 0 ? '#e67e22' : 'var(--primary-color)' }}>
                <span>Sobras Estimadas (Até o início dia {formatarDataLocal(dataInicioManual)})</span>
                <strong>+ {sobraLive} comp.</strong>
              </div>
            )}

            {mudou_medicamento && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.95rem', color: '#7f8c8d', fontStyle: 'italic' }}>
                <span>Sobras do ciclo anterior desconsideradas por troca de tratamento</span>
                <strong>0 comp.</strong>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '4px', borderTop: '1px solid rgba(0,0,0,0.1)', color: '#27ae60', fontSize: '1.05rem' }}>
              <span><strong>Total do Novo Ciclo</strong></span>
              <strong>{totalEstoqueLive} comp.</strong>
            </div>

            {/* LÓGICA DO ALERTA EDUCATIVO (RETROATIVO E PAUSA NO TRATAMENTO) */}
            {(() => {
              if (!dataInicioManual || !dataInicioAtual) return null;

              const dataNovoInicio = new Date(dataInicioManual + 'T00:00:00');
              
              const estoqueOriginal = Number(estoqueHoje) || 0;
              const posologiaOriginal = Number(posologiaAtual) || 1;
              const dataHojeObj = new Date();
              dataHojeObj.setHours(0, 0, 0, 0);
              
              let dataFimAntigoObj = new Date(dataHojeObj.getTime());
              dataFimAntigoObj.setDate(dataFimAntigoObj.getDate() + Math.floor(estoqueOriginal / posologiaOriginal));

              const isRetroativo = dataNovoInicio < dataFimAntigoObj;
              const isFuturoMuitoDistante = diasSemMedicacao > 0;

              if (isRetroativo && !mudou_medicamento) {
                return (
                  <AlertMessage style={{ borderLeftColor: '#3498db', backgroundColor: '#ebf5fb', color: '#2980b9' }}>
                    <LuPackageCheck size={22} color="#2980b9" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ color: '#2c3e50', fontSize: '0.95em' }}>Estoque Unificado (Recálculo Automático)</strong>
                      <span style={{ lineHeight: '1.4' }}>
                        Como a nova caixa foi iniciada <strong>antes</strong> do fim do ciclo anterior, os comprimidos foram somados. 
                        O total projetado é mantido porque o consumo diário ({posologiaAtual} comp/dia) não foi alterado.
                      </span>
                    </div>
                  </AlertMessage>
                );
              }

              if (isFuturoMuitoDistante) {
                 return (
                  <AlertMessage>
                    <LuTriangleAlert size={22} color="#e67e22" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ color: '#e67e22', fontSize: '0.95em' }}>Risco de Pausa no Tratamento</strong>
                      <span style={{ lineHeight: '1.4' }}>
                        No início do novo ciclo o paciente vai ficar até <strong>{diasSemMedicacao} {diasSemMedicacao === 1 ? 'dia' : 'dias'}</strong> sem a medicação. Confirme se a data programada está correta.
                      </span>
                    </div>
                  </AlertMessage>
                 );
              }

              return null;
            })()}

          </DetalhamentoBox>
        </ItemBlock>
      </GridInfo>

      <CheckboxWrapper>
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChangeChecked(e.target.checked)} 
        />
        <span>Aplicar dados desta nova compra automaticamente no fechamento deste contato</span>
      </CheckboxWrapper>

      {checked && (
        <div style={{ marginTop: '15px', padding: '15px', background: 'var(--surface-color)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <FormGroup style={{ margin: '0 0 15px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LuCalendarClock size={16} />
              Data Programada para Iniciar a Nova Caixa
            </label>
            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', display: 'block' }}>
              Baseada na previsão de administração da nova compra. Edite se o paciente planeja iniciar em outra data.
            </span>
            <Input
              type="date"
              value={dataInicioManual}
              onChange={(e) => onChangeDataInicio(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Posologia do Novo Ciclo (Comprimidos/dia)
            </label>
            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', display: 'block' }}>
              Confirme ou altere a quantidade de comprimidos que o paciente deverá tomar por dia.
            </span>
            <Input
              type="number"
              min="1"
              value={posologiaNovaCaixa}
              onChange={(e) => onChangePosologiaNova(e.target.value)}
              required
            />
          </FormGroup>
        </div>
      )}
    </BannerContainer>
  );
}