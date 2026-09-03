import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { ModalOverlay, ModalContent, FormGroup, Input, TextArea, Button } from './styles';

// Converte um bloco de texto (um item por linha) numa lista, e vice-versa —
// forma mais simples de editar uma lista de itens sem precisar de um
// componente de "adicionar/remover linha".
const paraLista = (texto) => texto.split('\n').map(l => l.trim()).filter(Boolean);
const paraTexto = (lista) => (lista || []).join('\n');

export default function VersaoTermoModal({ versaoAtual, onClose, onCriada }) {
  const [titulo, setTitulo] = useState('TERMO DE ACEITE PARA NAVEGAÇÃO E CONTATO VIA WHATSAPP');
  const [introducao, setIntroducao] = useState(versaoAtual?.conteudo?.introducao || '');
  const [textoAutorizacao, setTextoAutorizacao] = useState(versaoAtual?.conteudo?.textoAutorizacao || '');
  const [finalidades, setFinalidades] = useState(paraTexto(versaoAtual?.conteudo?.finalidades));
  const [textoCiente, setTextoCiente] = useState(versaoAtual?.conteudo?.textoCiente || '');
  const [itensCiente, setItensCiente] = useState(paraTexto(versaoAtual?.conteudo?.itensCiente));
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!introducao.trim() || paraLista(finalidades).length === 0 || paraLista(itensCiente).length === 0) {
      toast.error('Preencha ao menos a introdução e as duas listas (uma linha por item).');
      return;
    }

    const confirmar = window.confirm(
      'Criar uma nova versão do termo? A versão atual deixa de ser usada em novos aceites (mas continua valendo pra quem já aceitou sob ela — nada muda retroativamente).'
    );
    if (!confirmar) return;

    try {
      setSalvando(true);
      await api.post('/termos/versoes', {
        titulo,
        introducao,
        textoAutorizacao,
        finalidades: paraLista(finalidades),
        textoCiente,
        itensCiente: paraLista(itensCiente)
      });
      toast.success('Nova versão do termo criada e ativada!');
      onCriada();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao criar nova versão.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Nova Versão do Termo</h3>
        <p style={{ opacity: 0.75, fontSize: '0.85rem', marginBottom: '18px' }}>
          Use <code>{'{OPERADORA}'}</code> no texto da introdução onde quiser que o nome da operadora do paciente entre automaticamente.
        </p>

        <FormGroup>
          <label>Título do documento</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <label>Introdução (após "Eu, Nome, CPF nº XXX,")</label>
          <TextArea rows={2} value={introducao} onChange={(e) => setIntroducao(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <label>Texto de autorização (antes da lista de finalidades)</label>
          <TextArea rows={2} value={textoAutorizacao} onChange={(e) => setTextoAutorizacao(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <label>Finalidades (uma por linha)</label>
          <TextArea rows={5} value={finalidades} onChange={(e) => setFinalidades(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <label>Texto "declaro estar ciente de que"</label>
          <TextArea rows={2} value={textoCiente} onChange={(e) => setTextoCiente(e.target.value)} />
        </FormGroup>

        <FormGroup style={{ marginBottom: 0 }}>
          <label>Itens de ciência (um por linha)</label>
          <TextArea rows={4} value={itensCiente} onChange={(e) => setItensCiente(e.target.value)} />
        </FormGroup>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>Cancelar</Button>
          <Button variant="primary" bold onClick={handleSalvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Criar e Ativar Versão'}
          </Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
