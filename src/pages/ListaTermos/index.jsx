import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Container,
    Card,
    Title,
    Text,
    Button,
    LoadingContainer,
    Table,
    Th,
    Td,
    Tr
} from './styles';

export default function TermosListagemAdmin() {
    const [anexos, setAnexos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarTodosAnexos();
    }, []);

    const carregarTodosAnexos = async () => {
        try {
            setLoading(true);
            // Chama a rota nova que criamos no backend
            const response = await api.get('/termos-anexos/todos');
            setAnexos(response.data);
        } catch (error) {
            console.error("Erro ao carregar lista de termos:", error);
            alert("Erro ao carregar os termos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (dataIso) => {
        if (!dataIso) return '-';
        return new Date(dataIso).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return <LoadingContainer>Carregando documentos...</LoadingContainer>;
    }

    return (
        <Container style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
            <Card style={{ maxWidth: '1800px', width: '100%' }}>
                <Title>Gestão de Termos Assinados</Title>
                <Text large style={{ marginBottom: '30px' }}>
                    Histórico completo de termos de navegação aceitos pelos pacientes.
                </Text>

                {anexos.length === 0 ? (
                    <Text variant="muted">Nenhum termo assinado foi encontrado no sistema.</Text>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <thead>
                                <Tr>
                                    <Th>Paciente</Th>
                                    <Th>CPF</Th>
                                    <Th>Arquivo Gerado</Th>
                                    <Th>Data da Assinatura</Th>
                                    <Th style={{ textAlign: 'center' }}>Ação</Th>
                                </Tr>
                            </thead>
                            <tbody>
                                {anexos.map((anexo) => (
                                    <Tr key={anexo.id}>
                                        <Td>
                                            <strong>{anexo.paciente?.nome} {anexo.paciente?.sobrenome}</strong>
                                        </Td>
                                        <Td>{anexo.paciente?.cpf || '-'}</Td>
                                        <Td>{anexo.nome_original || 'Documento PDF'}</Td>
                                        <Td>{formatarData(anexo.createdAt)}</Td>
                                        <Td style={{ textAlign: 'center' }}>
                                            <Button 
                                                variant="primary" 
                                                style={{ padding: '8px 16px', fontSize: '14px', margin: '0 auto' }}
                                                onClick={() => window.open(anexo.url, '_blank')}
                                            >
                                                Visualizar / Baixar
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>
        </Container>
    );
}