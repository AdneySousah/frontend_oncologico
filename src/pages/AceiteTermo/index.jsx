import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function TelaAceiteTermo() {
    const { id } = useParams();
    const [statusTermo, setStatusTermo] = useState(null); // 'aceito', 'recusado', 'pendente'
    const [loading, setLoading] = useState(true);

    // 1. Busca o status atual do paciente ao carregar a página
    useEffect(() => {
        async function carregarStatusPaciente() {
            try {
                const response = await api.get(`/pacientes/${id}`);
                // Supondo que o status_termo venha dentro de response.data
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
            // Atualiza o status localmente para 'Aceito' ou 'Recusado' para disparar a renderização de sucesso
            setStatusTermo(aceita ? 'Aceito' : 'Recusado');
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

    // 3. Lógica principal: Se já foi respondido (Aceito ou Recusado)
    if (statusTermo === 'Aceito' || statusTermo === 'Recusado') {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
                <h2 style={{ color: '#28a745' }}>Atenção</h2>
                <p style={{ fontSize: '18px' }}>Você já respondeu a este termo anteriormente.</p>
                <p>A página já pode ser fechada com segurança.</p>
            </div>
        );
    }

    // 4. Renderização padrão (Pendente)
    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2 style={{ color: '#0056b3' }}>Acompanhamento Oncológico</h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                A Clínica CIC Oncologia solicita sua permissão para realizar contatos telefônicos 
                com o objetivo de acompanhar a evolução do seu tratamento.
            </p>
            <p>Você aceita os termos para este acompanhamento?</p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                <button 
                    onClick={() => handleResponder(true)} 
                    disabled={loading}
                    style={{ padding: '15px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Processando...' : 'Sim, eu aceito'}
                </button>
                <button 
                    onClick={() => handleResponder(false)} 
                    disabled={loading}
                    style={{ padding: '15px 30px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    Não aceito
                </button>
            </div>
        </div>
    );
}