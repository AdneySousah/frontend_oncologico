import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function TelaAceiteTermo() {
    const { id } = useParams();
    const [statusRespondido, setStatusRespondido] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResponder = async (aceita) => {
        setLoading(true);
        try {
            await api.post(`/termos/paciente/${id}`, { aceite: aceita });
            setStatusRespondido(true);
        } catch (error) {
            alert('Erro ao registrar resposta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (statusRespondido) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
                <h2>Obrigado!</h2>
                <p>Sua resposta foi registrada com sucesso.</p>
                <p>Você já pode fechar esta página.</p>
            </div>
        );
    }

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
                    style={{ padding: '15px 30px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
                    Sim, eu aceito
                </button>
                <button 
                    onClick={() => handleResponder(false)} 
                    disabled={loading}
                    style={{ padding: '15px 30px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
                    Não aceito
                </button>
            </div>
        </div>
    );
}