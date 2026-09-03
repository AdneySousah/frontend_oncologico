import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import {
  LuLayoutDashboard, LuCompass, LuActivity, LuHistory, LuCalculator,
  LuDollarSign, LuLogs, LuSearch, LuTriangleAlert, LuLightbulb, LuConstruction
} from 'react-icons/lu';
import * as S from './styles';
import { topicos } from './content';
import {
  IlustracaoDashboard, IlustracaoNecessidadeNavegacao, IlustracaoTelemonitoramento,
  IlustracaoLinhaDoTempo, IlustracaoRecalculo, IlustracaoFaturamento, IlustracaoAuditoria
} from './ilustracoes';

const mapaIlustracoes = {
  'dashboard': IlustracaoDashboard,
  'necessidade-navegacao': IlustracaoNecessidadeNavegacao,
  'telemonitoramento': IlustracaoTelemonitoramento,
  'linha-do-tempo': IlustracaoLinhaDoTempo,
  'recalculo': IlustracaoRecalculo,
  'faturamento': IlustracaoFaturamento,
  'auditoria': IlustracaoAuditoria
};

// Mapeia cada tópico ao mesmo ícone já usado no menu lateral real, pra
// manter a mesma linguagem visual do restante do sistema.
const iconesPorTopico = {
  'dashboard': LuLayoutDashboard,
  'necessidade-navegacao': LuCompass,
  'telemonitoramento': LuActivity,
  'linha-do-tempo': LuHistory,
  'recalculo': LuCalculator,
  'faturamento': LuDollarSign,
  'auditoria': LuLogs
};

function BlocoSecao({ secao }) {
  const theme = useTheme();

  if (secao.tipo === 'ilustracao') {
    const Ilustracao = mapaIlustracoes[secao.componente];
    if (!Ilustracao) return null;
    return (
      <S.Secao style={{ maxWidth: '640px' }}>
        <Ilustracao theme={theme} />
      </S.Secao>
    );
  }
  if (secao.tipo === 'texto') {
    return (
      <S.Secao>
        <h3>{secao.titulo}</h3>
        <p>{secao.conteudo}</p>
      </S.Secao>
    );
  }
  if (secao.tipo === 'lista') {
    return (
      <S.Secao>
        <h3>{secao.titulo}</h3>
        <S.ListaItens>
          {secao.itens.map((item, i) => <li key={i}>{item}</li>)}
        </S.ListaItens>
      </S.Secao>
    );
  }
  if (secao.tipo === 'passos') {
    return (
      <S.Secao>
        <h3>{secao.titulo}</h3>
        <S.PassosLista>
          {secao.itens.map((item, i) => <li key={i}>{item}</li>)}
        </S.PassosLista>
      </S.Secao>
    );
  }
  if (secao.tipo === 'atencao' || secao.tipo === 'dica') {
    const Icone = secao.tipo === 'atencao' ? LuTriangleAlert : LuLightbulb;
    return (
      <S.Secao>
        <S.CalloutBox $tipo={secao.tipo}>
          <Icone size={20} className="icon" />
          <div>
            <h3>{secao.titulo}</h3>
            <p>{secao.conteudo}</p>
          </div>
        </S.CalloutBox>
      </S.Secao>
    );
  }
  return null;
}

export default function BaseConhecimento() {
  const [topicoAtivoId, setTopicoAtivoId] = useState(topicos[0].id);
  const [busca, setBusca] = useState('');

  const topicoAtivo = topicos.find(t => t.id === topicoAtivoId);
  const grupos = [...new Set(topicos.map(t => t.grupo))];

  const topicosFiltrados = topicos.filter(t =>
    t.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  const IconeAtivo = iconesPorTopico[topicoAtivo.id] || LuLayoutDashboard;

  return (
    <S.Container>
      <S.TopicNav>
        <S.NavHeader>
          <h2>Base de Conhecimento</h2>
          <p>Como usar cada aba do sistema</p>
        </S.NavHeader>

        <S.SearchBox>
          <LuSearch size={16} />
          <input
            placeholder="Buscar assunto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </S.SearchBox>

        {grupos.map(grupo => {
          const itensGrupo = topicosFiltrados.filter(t => t.grupo === grupo);
          if (itensGrupo.length === 0) return null;
          return (
            <div key={grupo}>
              <S.GroupLabel>{grupo}</S.GroupLabel>
              {itensGrupo.map(t => {
                const Icone = iconesPorTopico[t.id] || LuLayoutDashboard;
                return (
                  <S.TopicButton
                    key={t.id}
                    $active={topicoAtivoId === t.id}
                    $pronto={t.status === 'completo'}
                    onClick={() => setTopicoAtivoId(t.id)}
                  >
                    <Icone size={17} />
                    {t.titulo}
                    <span className="status-dot" title={t.status === 'completo' ? 'Conteúdo completo' : 'Em construção'} />
                  </S.TopicButton>
                );
              })}
            </div>
          );
        })}
      </S.TopicNav>

      <S.ContentArea>
        <S.ContentHeader $cor={topicoAtivo.corDestaque}>
          <div className="icon-badge">
            <IconeAtivo size={24} />
          </div>
          <h1>{topicoAtivo.titulo}</h1>
        </S.ContentHeader>
        <S.ContentResumo>{topicoAtivo.resumo}</S.ContentResumo>

        {topicoAtivo.status === 'em_construcao' || !topicoAtivo.secoes ? (
          <S.EmConstrucaoBox>
            <LuConstruction size={32} />
            <p>
              O conteúdo detalhado desta seção ainda está sendo escrito.
              Volte em breve — as seções são adicionadas uma de cada vez pra garantir
              que cada explicação esteja realmente completa e correta.
            </p>
          </S.EmConstrucaoBox>
        ) : (
          topicoAtivo.secoes.map((secao, i) => <BlocoSecao key={i} secao={secao} />)
        )}
      </S.ContentArea>
    </S.Container>
  );
}
