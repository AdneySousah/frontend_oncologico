import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import {
    Container,
    Card,
    Title,
    Text,
    ButtonGroup,
    Button,
    LoadingContainer,
    CheckboxContainer,
    Checkbox,
    CheckboxLabel,
    TermLink,
    ErrorMessage
} from './styles';

export default function TelaAceiteTermo() {
    // 1. Pega o ID do paciente diretamente da URL pública (/paciente/termo/:id)
    const { id } = useParams();
    
    const [statusTermo, setStatusTermo] = useState(null); // 'Aceito', 'Recusado', 'Pendente'
    const [loading, setLoading] = useState(true);
    const [showConfirmReject, setShowConfirmReject] = useState(false);
    const [operadora, setOperadora] = useState(null);
    const [dataAceite, setDataAceite] = useState(null); 
    const [termosAceitos, setTermosAceitos] = useState(false);
    const [erroCheckbox, setErroCheckbox] = useState(false);

    // 2. Busca o status atual do paciente ao carregar a página na rota pública GET /pacientes/:id
    useEffect(() => {
        async function carregarStatusPaciente() {
            try {
                setLoading(true);
                const response = await api.get(`/pacientes/${id}`);
                const paciente = response.data.paciente;
                
                if (paciente) {
                    setStatusTermo(paciente.status_termo);
                    setOperadora(paciente.operadoras?.nome || 'nossa equipe de saúde');
                    
                    if (paciente.termo_data_aceite) {
                        setDataAceite(paciente.termo_data_aceite);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do paciente:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            carregarStatusPaciente();
        }
    }, [id]);

    // 3. Envia a resposta do paciente (Aceito ou Recusado) para o backend
    const handleResponder = async (aceita) => {
        if (aceita && !termosAceitos) {
            setErroCheckbox(true);
            return;
        }

        try {
            setLoading(true);
            setErroCheckbox(false);

            // POST público para /termos/paciente/:id
            const response = await api.post(`/termos/paciente/${id}`, { aceite: aceita });
            
            setStatusTermo(aceita ? 'Aceito' : 'Recusado');
            
            if (aceita && response.data.termo_data_aceite) {
                setDataAceite(response.data.termo_data_aceite);
            }
            
            setShowConfirmReject(false);
        } catch (error) {
            console.error(error);
            alert('Erro ao registrar sua resposta. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (e) => {
        setTermosAceitos(e.target.checked);
        if (e.target.checked) {
            setErroCheckbox(false);
        }
    };

    const formatarDataHora = (dataIso) => {
        if (!dataIso) return '';
        const data = new Date(dataIso);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- RENDERIZAÇÕES CONDICIONAIS DE TELA ---

    // Tela de Carregamento
    if (loading && !statusTermo) {
        return <LoadingContainer>Carregando informações...</LoadingContainer>;
    }

    // Fluxo 1: Paciente já havia ACEITADO o termo anteriormente
    if (statusTermo === 'Aceito') {
        return (
            <Container>
                <Card>
                    <Title variant="success">Atenção</Title>
                    <Text large>Você já respondeu a este termo anteriormente e aceitou o acompanhamento.</Text>
                    
                    {dataAceite && (
                        <Text style={{ marginTop: '10px', fontWeight: 'bold', color: '#666' }}>
                            Aceito em: {formatarDataHora(dataAceite)}
                        </Text>
                    )}
                    
                    <Text mt="20px">A página já pode ser fechada com segurança.</Text>
                </Card>
            </Container>
        );
    }

    // Fluxo 2: Paciente já havia RECUSADO o termo anteriormente
    if (statusTermo === 'Recusado') {
        return (
            <Container>
                <Card>
                    <Title variant="danger">Atendimento Suspenso</Title>
                    <Text large>Entendemos a sua escolha. Como o termo não foi aceito, não conseguiremos dar seguimento ao seu acompanhamento programado.</Text>
                    <Text variant="muted" mt="20px">
                        Caso tenha escolhido a opção errada por engano, informe ao atendente no WhatsApp para que ele possa gerar um novo link para você.
                    </Text>
                </Card>
            </Container>
        );
    }

    // Fluxo 3: Janela de confirmação caso ele clique em "Não aceito"
    if (showConfirmReject) {
        return (
            <Container>
                <Card isAlert>
                    <Title variant="alert">Tem certeza que não quer aceitar o termo?</Title>
                    <Text variant="alert">
                        O acompanhamento é fundamental para monitorarmos a trajetória do seu tratamento e garantir uma melhor assistência à sua saúde.
                    </Text>

                    <ButtonGroup>
                        <Button
                            variant="secondary"
                            onClick={() => setShowConfirmReject(false)}
                            disabled={loading}
                        >
                            Não, voltar
                        </Button>
                        <Button
                            variant="danger"
                            bold
                            onClick={() => handleResponder(false)}
                            disabled={loading}
                        >
                            {loading ? 'Processando...' : 'Sim, não quero aceitar'}
                        </Button>
                    </ButtonGroup>
                </Card>
            </Container>
        );
    }

    // Fluxo Padrão: Tela Inicial do Termo (Pendente)
    return (
        <Container>
            <Card>
                <Title>Termo de Aceite para Navegação</Title>
                <Text large>
                    A <strong>{operadora}</strong> solicita sua permissão para realizar contatos telefônicos e digitais 
                    com o objetivo de acompanhar de perto a evolução do seu tratamento de saúde.
                </Text>
                <Text>Você aceita os termos para este acompanhamento?</Text>

                {/* Checkbox de leitura obrigatória ligada ao PDF de Preview */}
                <CheckboxContainer>
                    <Checkbox
                        id="aceite-termos"
                        checked={termosAceitos}
                        onChange={handleCheckboxChange}
                    />
                    <CheckboxLabel htmlFor="aceite-termos">
                        Li e aceito os{' '}
                        <TermLink
                            href={`${api.defaults.baseURL}/termos/paciente/${id}/preview-pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            termos e condições
                        </TermLink>
                        {' '}para aplicação do acompanhamento.
                    </CheckboxLabel>
                </CheckboxContainer>

                <ErrorMessage>
                    {erroCheckbox ? 'Por favor, marque a caixa de aceite dos termos antes de continuar.' : ''}
                </ErrorMessage>

                <ButtonGroup>
                    <Button
                        variant="success"
                        onClick={() => handleResponder(true)}
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : 'Sim, eu aceito'}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setShowConfirmReject(true)}
                        disabled={loading}
                    >
                        Não aceito
                    </Button>
                </ButtonGroup>
            </Card>
        </Container>
    );
}