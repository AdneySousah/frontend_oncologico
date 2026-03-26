import React, { useState, useEffect, useRef } from 'react';
import { LuSend, LuUser, LuKey, LuCheckCheck } from 'react-icons/lu';
import api from '../../../../services/api';
import * as S from './styles';

export default function ChatWindow({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [conversationData, setConversationData] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!chatId) return;

    const fetchHistory = async () => {
      try {
        const response = await api.get(`/chat/conversations/${chatId}`);
        // O backend agora retorna { conversation, messages }
        setConversationData(response.data.conversation);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Erro ao buscar histórico do chat:", error);
      }
    };

    fetchHistory();
    const intervalId = setInterval(fetchHistory, 5000);
    return () => clearInterval(intervalId);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const response = await api.post('/chat/send', {
        conversation_id: chatId,
        body: newMessage
      });
      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao enviar mensagem.");
    } finally {
      setLoading(false);
    }
  };

  // Função para reabrir a janela
  const handleReopenWindow = async () => {
    try {
      setLoading(true);
      const response = await api.post('/chat/reopen', { conversation_id: chatId });

      // Adiciona o template disparado na tela e atualiza a conversa
      setMessages((prev) => [...prev, response.data.message]);
      setConversationData(response.data.conversation);

    } catch (error) {
      alert("Erro ao reabrir a janela.");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se a janela expirou
  const isExpired = conversationData?.window_expires_at
    ? new Date(conversationData.window_expires_at) < new Date()
    : true;

  // Monta o nome do cabeçalho
  const displayName = conversationData?.paciente
    ? `${conversationData.paciente.nome} ${conversationData.paciente.sobrenome}`
    : (conversationData?.phone_number || `Chat #${chatId}`);

  return (
    <S.WindowContainer>

      {/* CABEÇALHO DO CHAT */}
      <S.ChatHeader>
        <div className="header-avatar">
          {conversationData?.paciente ? conversationData.paciente.nome.substring(0, 2).toUpperCase() : <LuUser size={24} />}
        </div>
        <div className="header-info">
          <h3>{displayName}</h3>
          <span style={{ color: isExpired ? '#ff4d4f' : '#25D366' }}>
            {isExpired ? 'Janela Expirada (Inativa)' : 'Janela 24h Ativa'}
          </span>
        </div>
      </S.ChatHeader>

      {/* ÁREA DE MENSAGENS */}
      <S.MessagesArea>
        {messages.map((msg) => {
          const isMine = msg.direction === 'outbound-reply' || msg.direction === 'outbound-api';

          return (
            <S.MessageBubble key={msg.id} $isMine={isMine}>
              {isMine && msg.usuario && (
                <span className="user-name">{msg.usuario.name}</span>
              )}
              {isMine && !msg.usuario && msg.direction === 'outbound-api' && (
                <span className="user-name">Robô / Sistema</span>
              )}

              {msg.body}

              <div className="meta-data">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isMine && (
                  <span style={{ marginLeft: '4px', display: 'flex', alignItems: 'center' }}>
                    <LuCheckCheck size={14} color="#999" title="Entregue na API da Meta" />
                  </span>
                )}
              </div>
            </S.MessageBubble>
          );
        })}
        <div ref={messagesEndRef} />
      </S.MessagesArea>

      {/* ÁREA DE INPUT OU BLOQUEIO */}
      {isExpired ? (
        <S.BlockedArea>
          <p>A janela de 24 horas da Meta expirou. Para voltar a conversar em texto livre, você precisa enviar um template de engajamento.</p>
          <button onClick={handleReopenWindow} disabled={loading}>
            <LuKey size={18} />
            {loading ? 'Enviando...' : 'Desbloquear Chat (Enviar Termo)'}
          </button>
        </S.BlockedArea>
      ) : (
        <S.InputArea as="form" onSubmit={handleSendMessage}>
          <S.ChatInput
            placeholder="Digite sua mensagem e aperte Enter..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <S.SendButton type="submit" disabled={!newMessage.trim() || loading}>
            <LuSend size={20} style={{ marginLeft: '-2px' }} />
          </S.SendButton>
        </S.InputArea>
      )}

    </S.WindowContainer>
  );
}