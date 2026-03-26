import React, { useState } from 'react';
import { LuMessageCircle } from 'react-icons/lu';
import ChatSidebar from './Components/chatsidebar';
import * as S from './styles';
import ChatWindow from './Components/chatwindow';

export default function ChatModule() {
    // Estado que controla qual conversa foi clicada na Sidebar
    const [activeChatId, setActiveChatId] = useState(null);

    return (
        <S.ChatLayoutContainer>

            {/* BARRA LATERAL (Listagem, Horas e Limites) */}
            <ChatSidebar
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
            />

            {/* ÁREA DE MENSAGENS (A Direita) */}
            <S.ChatWindowArea>
                {activeChatId ? (
                    <ChatWindow chatId={activeChatId} /> // SUBSTITUA A DIV DE TESTE POR ISSO!
                ) : (
                    <S.EmptyChat>
                        <LuMessageCircle size={80} opacity={0.3} />
                        <h2>Selecione um paciente para ver as conversas</h2>
                    </S.EmptyChat>
                )}
            </S.ChatWindowArea>

        </S.ChatLayoutContainer>
    );
}