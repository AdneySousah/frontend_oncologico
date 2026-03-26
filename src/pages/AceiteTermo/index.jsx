import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function TelaAceiteTermo() {
    const { id } = useParams();
    const [statusTermo, setStatusTermo] = useState(null); // 'Aceito', 'Recusado', 'Pendente'
    const [loading, setLoading] = useState(true);
    
    // ✅ NOVO: Estado para controlar a tela de confirmação de recusa
    const [showConfirmReject, setShowConfirmReject] = useState(false); 

    // 1. Busca o status atual do paciente ao carregar a página
    useEffect(() => {
        async function carregarStatusPaciente() {
            try {
                const response = await api.get(`/pacientes/${id}`);
                setStatusTermo(response.data.paciente.status_termo);
            } catch (error) {
                console.error("Erro ao buscar dados do paciente", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) carregarStatusPaciente();
    }, [id]);

    const handleResponder = async (aceita) => {
        setLoading(true);
        try {
            await api.post(`/termos/paciente/${id}`, { aceite: aceita });
            setStatusTermo(aceita ? 'Aceito' : 'Recusado');
            setShowConfirmReject(false); // Limpa a confirmação por garantia
        } catch (error) {
            alert('Erro ao registrar resposta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // 2. Tela de carregamento inicial
    if (loading && !statusTermo) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando informações...</div>;
    }

    // 3. Lógica principal: Se já foi respondido como ACEITO
    if (statusTermo === 'Aceito') {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
                <h2 style={{ color: '#28a745' }}>Atenção</h2>
                <p style={{ fontSize: '18px' }}>Você já respondeu a este termo anteriormente e aceitou o acompanhamento.</p>
                <p>A página já pode ser fechada com segurança.</p>
            </div>
        );
    }

    // 4. Lógica principal: Se já foi respondido como RECUSADO (Mensagem Final)
    if (statusTermo === 'Recusado') {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
                <h2 style={{ color: '#dc3545' }}>Atendimento Suspenso</h2>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                    Ok, como não aceitou não conseguimos dar seguimento ao seu atendimento.
                </p>
                <p style={{ color: '#666', marginTop: '20px' }}>
                    Caso tenha escolhido a opção errada, informe ao atendente no WhatsApp para que ele gere um novo link.
                </p>
            </div>
        );
    }

    // 5. Tela de Confirmação de Recusa ("Tem Certeza?")
    if (showConfirmReject) {
        return (
            <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px 20px', textAlign: 'center', fontFamily: 'sans-serif', border: '1px solid #f5c6cb', borderRadius: '8px', backgroundColor: '#f8d7da' }}>
                <h2 style={{ color: '#721c24' }}>Tem certeza que não quer aceitar o termo?</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#721c24' }}>
                    Ao recusar, nós não poderemos prosseguir com o seu acompanhamento oncológico.
                </p>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => setShowConfirmReject(false)} 
                        disabled={loading}
                        style={{ padding: '12px 25px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                        Não, voltar
                    </button>
                    <button 
                        onClick={() => handleResponder(false)} 
                        disabled={loading}
                        style={{ padding: '12px 25px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                        {loading ? 'Processando...' : 'Sim, não quero aceitar'}
                    </button>
                </div>
            </div>
        );
    }

    // 6. Renderização padrão (Pergunta Inicial)
    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2 style={{ color: '#0056b3' }}>Acompanhamento Oncológico</h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                A Clínica CIC Oncologia solicita sua permissão para realizar contatos telefônicos 
                com o objetivo de acompanhar a evolução do seu tratamento.
            </p>
            <p>Você aceita os termos para este acompanhamento?</p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                <button 
                    onClick={() => handleResponder(true)} 
                    disabled={loading}
                    style={{ padding: '15px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Processando...' : 'Sim, eu aceito'}
                </button>
                <button 
                    onClick={() => setShowConfirmReject(true)} 
                    disabled={loading}
                    style={{ padding: '15px 30px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    Não aceito
                </button>
            </div>
        </div>
    );
}