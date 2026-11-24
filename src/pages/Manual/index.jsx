import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Lu from 'react-icons/lu';
import { grupos, topicos } from './conteudo';
import * as S from './styles';

const { LuBookOpen, LuSearch, LuX, LuArrowLeft, LuArrowRight, LuChevronRight, LuChevronDown,
  LuTriangleAlert, LuLightbulb, LuExternalLink, LuUsers, LuCircleHelp } = Lu;

// Ícones que o conteúdo pode pedir e não existem nesta versão do react-icons
const ICONES_ALTERNATIVOS = { LuFileSignature: 'LuFilePen' };

function Icone({ nome, size = 20 }) {
  const Comp = Lu[nome] || Lu[ICONES_ALTERNATIVOS[nome]] || LuCircleHelp;
  return <Comp size={size} aria-hidden="true" />;
}

// Converte **texto** em <strong>texto</strong> sem usar HTML cru
function Rico({ texto }) {
  const partes = String(texto ?? '').split(/(\*\*[^*]+\*\*)/g);
  return partes.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p
  );
}

const normalizar = (t) =>
  String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function textoDoTopico(t) {
  const blocos = (t.blocos || []).map((b) => [
    b.titulo, b.conteudo,
    ...(b.itens || []).map((i) => (typeof i === 'string' ? i : `${i.pergunta} ${i.resposta}`)),
  ].join(' '));
  return normalizar([t.titulo, t.resumo, ...(t.palavrasChave || []), ...blocos].join(' '));
}

function BlocoConteudo({ bloco }) {
  switch (bloco.tipo) {
    case 'passos':
      return (
        <S.Block>
          {bloco.titulo && <h3>{bloco.titulo}</h3>}
          <ol>{bloco.itens.map((item, i) => <li key={i}><Rico texto={item} /></li>)}</ol>
        </S.Block>
      );
    case 'lista':
      return (
        <S.Block>
          {bloco.titulo && <h3>{bloco.titulo}</h3>}
          <ul>{bloco.itens.map((item, i) => <li key={i}><Rico texto={item} /></li>)}</ul>
        </S.Block>
      );
    case 'atencao':
    case 'dica':
      return (
        <S.Callout $tipo={bloco.tipo}>
          {bloco.tipo === 'atencao' ? <LuTriangleAlert size={20} aria-hidden="true" /> : <LuLightbulb size={20} aria-hidden="true" />}
          <div>
            {bloco.titulo && <h3>{bloco.titulo}</h3>}
            <p><Rico texto={bloco.conteudo} /></p>
          </div>
        </S.Callout>
      );
    case 'faq':
      return (
        <S.Block>
          {bloco.titulo && <h3>{bloco.titulo}</h3>}
          <S.Faq>
            {bloco.itens.map((item, i) => (
              <details key={i}>
                <summary>{item.pergunta}<LuChevronDown size={18} aria-hidden="true" /></summary>
                <p><Rico texto={item.resposta} /></p>
              </details>
            ))}
          </S.Faq>
        </S.Block>
      );
    default:
      return (
        <S.Block>
          {bloco.titulo && <h3>{bloco.titulo}</h3>}
          <p><Rico texto={bloco.conteudo} /></p>
        </S.Block>
      );
  }
}

export default function Manual() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [busca, setBusca] = useState('');
  const artigoRef = useRef(null);

  const idAtual = params.get('t');
  const topico = topicos.find((t) => t.id === idAtual) || null;
  // No computador sempre mostra um tópico; no celular, sem tópico escolhido mostra o índice.
  const topicoExibido = topico || topicos[0];

  const indiceBusca = useMemo(() => topicos.map((t) => ({ id: t.id, texto: textoDoTopico(t) })), []);

  const encontrados = useMemo(() => {
    const termos = normalizar(busca).split(/\s+/).filter(Boolean);
    if (!termos.length) return null;
    const ids = new Set(indiceBusca.filter((i) => termos.every((t) => i.texto.includes(t))).map((i) => i.id));
    return topicos.filter((t) => ids.has(t.id));
  }, [busca, indiceBusca]);

  // Ao trocar de tópico (não na primeira abertura), leva o leitor para o início do texto
  const primeiraRenderizacao = useRef(true);
  useEffect(() => {
    if (primeiraRenderizacao.current) { primeiraRenderizacao.current = false; return; }
    if (idAtual) artigoRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [idAtual]);

  const abrir = (id) => setParams({ t: id });
  const voltarAoIndice = () => setParams({});

  const posicao = topicos.findIndex((t) => t.id === topicoExibido.id);
  const anterior = topicos[posicao - 1];
  const proximo = topicos[posicao + 1];

  const itemDoIndice = (t) => (
    <li key={t.id}>
      <S.IndexItem
        type="button"
        $active={topico?.id === t.id}
        aria-current={topico?.id === t.id ? 'page' : undefined}
        onClick={() => abrir(t.id)}
      >
        <span className="icone"><Icone nome={t.icone} size={18} /></span>
        <span className="textos">
          <strong>{t.titulo}</strong>
          <small>{t.resumo}</small>
        </span>
        <LuChevronRight className="seta" size={18} aria-hidden="true" />
      </S.IndexItem>
    </li>
  );

  return (
    <S.Page>
      <S.Header>
        <h1><LuBookOpen size={28} aria-hidden="true" /> Manual do Sistema</h1>
        <p>Como usar cada tela do Onco Navegação, do primeiro acesso ao acompanhamento do paciente.</p>
        <S.SearchBox>
          <LuSearch className="lupa" size={20} aria-hidden="true" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar no manual (ex.: pausa)"
            aria-label="Buscar no manual"
          />
          {busca && (
            <button type="button" aria-label="Limpar busca" onClick={() => setBusca('')}>
              <LuX size={18} />
            </button>
          )}
        </S.SearchBox>
      </S.Header>

      <S.Layout>
        <S.Index aria-label="Tópicos do manual" $hiddenOnMobile={!!topico}>
          {encontrados ? (
            <>
              <h2>{encontrados.length ? `${encontrados.length} tópico(s) encontrado(s)` : 'Resultado da busca'}</h2>
              {encontrados.length
                ? <ul>{encontrados.map(itemDoIndice)}</ul>
                : <S.Empty>Nada encontrado para “{busca}”. Tente outra palavra.</S.Empty>}
            </>
          ) : (
            grupos.map((g) => {
              const doGrupo = topicos.filter((t) => t.grupo === g.id);
              if (!doGrupo.length) return null;
              return (
                <div key={g.id}>
                  <h2>{g.titulo}</h2>
                  <ul>{doGrupo.map(itemDoIndice)}</ul>
                </div>
              );
            })
          )}
        </S.Index>

        <S.Article ref={artigoRef} $hiddenOnMobile={!topico} aria-live="polite">
          <S.BackButton type="button" onClick={voltarAoIndice}>
            <LuArrowLeft size={18} aria-hidden="true" /> Todos os tópicos
          </S.BackButton>

          <S.TopicHeader>
            <div className="titulo">
              <span className="icone"><Icone nome={topicoExibido.icone} size={22} /></span>
              <h2>{topicoExibido.titulo}</h2>
            </div>
            {topicoExibido.resumo && <p className="resumo">{topicoExibido.resumo}</p>}
            <div className="meta">
              {topicoExibido.quem && <S.Pill><LuUsers size={14} aria-hidden="true" /> {topicoExibido.quem}</S.Pill>}
              {topicoExibido.caminho && (
                <S.OpenScreenButton type="button" onClick={() => navigate(topicoExibido.caminho)}>
                  Abrir a tela <LuExternalLink size={14} aria-hidden="true" />
                </S.OpenScreenButton>
              )}
            </div>
          </S.TopicHeader>

          {(topicoExibido.blocos || []).map((b, i) => <BlocoConteudo key={i} bloco={b} />)}

          <S.Pager>
            {anterior && (
              <button type="button" onClick={() => abrir(anterior.id)}>
                <span><LuArrowLeft size={12} aria-hidden="true" /> Anterior</span>
                <strong>{anterior.titulo}</strong>
              </button>
            )}
            {proximo && (
              <button type="button" className="proximo" onClick={() => abrir(proximo.id)}>
                <span>Próximo <LuArrowRight size={12} aria-hidden="true" /></span>
                <strong>{proximo.titulo}</strong>
              </button>
            )}
          </S.Pager>
        </S.Article>
      </S.Layout>
    </S.Page>
  );
}
