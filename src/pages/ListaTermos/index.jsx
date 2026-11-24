import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import VersaoTermoModal from './VersaoTermoModal';
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
    Tr,
    VersaoAtivaBox
} from './styles';

// O PDF agora vem de uma rota autenticada: baixa com o token e abre numa nova aba.
// A janela é aberta antes do download para o navegador não bloquear o pop-up.
async function abrirPdfTermo(pacienteId) {
    const janela = window.open('', '_blank');
    try {
        const resposta = await api.get(`/termos/paciente/${pacienteId}/pdf`, { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([resposta.data], { type: 'application/pdf' }));
        if (janela) janela.location.href = url; else window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
        if (janela) janela.close();
        toast.error('Não foi possível abrir o termo. Tente novamente.');
    }
}

export default function TermosListagemAdmin() {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [versaoAtiva, setVersaoAtiva] = useState(null);
    const [modalVersaoAberto, setModalVersaoAberto] = useState(false);

    useEffect(() => {
        carregarTermosAceitos();
        carregarVersaoAtiva();
    }, []);

    const carregarVersaoAtiva = async () => {
        try {
            const response = await api.get('/termos/versoes');
            const ativa = response.data.find(v => v.ativo);
            setVersaoAtiva(ativa || null);
        } catch (error) {
            console.error("Erro ao carregar versão do termo:", error);
        }
    };

    const carregarTermosAceitos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/termos-anexos/todos');
            setPacientes(response.data);
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
                <Text large style={{ marginBottom: '20px' }}>
                    Histórico completo de termos de navegação aceitos pelos pacientes. O PDF é gerado na hora,
                    sempre com o texto exato que o paciente aceitou — nada fica salvo em arquivo.
                </Text>

                <VersaoAtivaBox>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <p><strong>Versão ativa do termo:</strong> {versaoAtiva ? `#${versaoAtiva.id} — ${versaoAtiva.titulo}` : 'Carregando...'}</p>
                            <p style={{ opacity: 0.75 }}>É esta versão que todo paciente novo vê e aceita a partir de agora. Pacientes que já aceitaram antes continuam vinculados à versão que eles realmente viram.</p>
                        </div>
                        <Button variant="secondary" style={{ padding: '8px 16px', fontSize: '14px', whiteSpace: 'nowrap' }} onClick={() => setModalVersaoAberto(true)}>
                            Criar Nova Versão
                        </Button>
                    </div>
                </VersaoAtivaBox>

                {pacientes.length === 0 ? (
                    <Text variant="muted">Nenhum termo aceito foi encontrado no sistema.</Text>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <thead>
                                <Tr>
                                    <Th>Paciente</Th>
                                    <Th>CPF</Th>
                                    <Th>Operadora</Th>
                                    <Th>Versão do Termo</Th>
                                    <Th>Data da Assinatura</Th>
                                    <Th style={{ textAlign: 'center' }}>Ação</Th>
                                </Tr>
                            </thead>
                            <tbody>
                                {pacientes.map((paciente) => (
                                    <Tr key={paciente.id}>
                                        <Td>
                                            <strong>{paciente.nome} {paciente.sobrenome}</strong>
                                        </Td>
                                        <Td>{paciente.cpf || '-'}</Td>
                                        <Td>{paciente.operadoras?.nome || '-'}</Td>
                                        <Td>{paciente.versaoTermo?.titulo ? `#${paciente.versaoTermo.id}` : '-'}</Td>
                                        <Td>{formatarData(paciente.termo_data_aceite)}</Td>
                                        <Td style={{ textAlign: 'center' }}>
                                            <Button
                                                variant="primary"
                                                style={{ padding: '8px 16px', fontSize: '14px', margin: '0 auto' }}
                                                onClick={() => abrirPdfTermo(paciente.id)}
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

            {modalVersaoAberto && (
                <VersaoTermoModal
                    versaoAtual={versaoAtiva}
                    onClose={() => setModalVersaoAberto(false)}
                    onCriada={() => {
                        setModalVersaoAberto(false);
                        carregarVersaoAtiva();
                    }}
                />
            )}
        </Container>
    );
}