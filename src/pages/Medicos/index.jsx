import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api'; // Ajuste o caminho da sua api
import MedicoForm from './components/MedicoForm';
import { Container, Title, ListContainer, MedicoCard, Badge } from './styles';

export default function Medicos() {
    const [medicos, setMedicos] = useState([]);

    const loadMedicos = async () => {
        try {
            const response = await api.get('/medicos');
            setMedicos(response.data);
        } catch (error) {
            toast.error('Erro ao buscar lista de médicos.');
        }
    };

    useEffect(() => {
        loadMedicos();
    }, []);

    return (
        <Container>
            <Title>Gestão de Médicos</Title>
            
            {/* Componente isolado para o formulário */}
            <MedicoForm onSuccess={loadMedicos} />

            <ListContainer>
                <h3>Médicos Cadastrados</h3>
                {medicos.length === 0 ? (
                    <p>Nenhum médico cadastrado ainda.</p>
                ) : (
                    medicos.map(medico => (
                        <MedicoCard key={medico.id}>
                            <div className="info">
                                <strong>{medico.nome}</strong>
                                <span>CRM: {medico.crm}</span>
                            </div>
                            <div className="locais">
                                {medico.locais_atendimento?.map(local => (
                                    <Badge key={local.id}>{local.nome}</Badge>
                                ))}
                            </div>
                        </MedicoCard>
                    ))
                )}
            </ListContainer>
        </Container>
    );
}