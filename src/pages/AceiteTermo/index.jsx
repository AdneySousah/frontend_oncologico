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
    const { id } = useParams();
    const [statusTermo, setStatusTermo] = useState(null); // 'Aceito', 'Recusado', 'Pendente'
    const [loading, setLoading] = useState(true);
    const [showConfirmReject, setShowConfirmReject] = useState(false); 
    const [operadora, setOperadora] = useState(null);

    // ✅ NOVOS: Estados para o checkbox e mensagem de erro
    const [termosAceitos, setTermosAceitos] = useState(false);
    const [erroCheckbox, setErroCheckbox] = useState(false);

    // 1. Busca o status atual do paciente ao carregar a página
    useEffect(() => {
        async function carregarStatusPaciente() {
            try {
                const response = await api.get(`/pacientes/${id}`);
                setStatusTermo(response.data.paciente.status_termo);
                setOperadora(response.data.paciente.operadoras.nome);
            } catch (error) {
                console.error("Erro ao buscar dados do paciente", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) carregarStatusPaciente();
    }, [id]);

    const handleResponder = async (aceita) => {
        // Validação: Se a pessoa clicou em "Aceitar", o checkbox DEVE estar marcado
        if (aceita && !termosAceitos) {
            setErroCheckbox(true);
            return; // Interrompe a função aqui
        }

        setLoading(true);
        setErroCheckbox(false); // Limpa o erro caso estivesse ativo

        try {
            await api.post(`/termos/paciente/${id}`, { aceite: aceita });
            setStatusTermo(aceita ? 'Aceito' : 'Recusado');
            setShowConfirmReject(false);
        } catch (error) {
            alert('Erro ao registrar resposta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função auxiliar para marcar/desmarcar e limpar o erro automaticamente
    const handleCheckboxChange = (e) => {
        setTermosAceitos(e.target.checked);
        if (e.target.checked) {
            setErroCheckbox(false);
        }
    };

    // 2. Tela de carregamento inicial
    if (loading && !statusTermo) {
        return <LoadingContainer>Carregando informações...</LoadingContainer>;
    }

    // 3. Lógica principal: Se já foi respondido como ACEITO
    if (statusTermo === 'Aceito') {
        return (
            <Container>
                <Card>
                    <Title variant="success">Atenção</Title>
                    <Text large>Você já respondeu a este termo anteriormente e aceitou o acompanhamento.</Text>
                    <Text>A página já pode ser fechada com segurança.</Text>
                </Card>
            </Container>
        );
    }

    // 4. Lógica principal: Se já foi respondido como RECUSADO (Mensagem Final)
    if (statusTermo === 'Recusado') {
        return (
            <Container>
                <Card>
                    <Title variant="danger">Atendimento Suspenso</Title>
                    <Text large>Ok, como não aceitou não conseguimos dar seguimento ao seu atendimento.</Text>
                    <Text variant="muted" mt="20px">
                        Caso tenha escolhido a opção errada, informe ao atendente no WhatsApp para que ele gere um novo link.
                    </Text>
                </Card>
            </Container>
        );
    }

    // 5. Tela de Confirmação de Recusa ("Tem Certeza?")
    if (showConfirmReject) {
        return (
            <Container>
                <Card isAlert>
                    <Title variant="alert">Tem certeza que não quer aceitar o termo?</Title>
                    <Text variant="alert">
                        Ao recusar, nós não conseguiremos dar seguimento a classificação do seu atedimento, ele é de suma importância para que possamos acompanhar melhor a trajetória do seu tratamento.
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

    // 6. Renderização padrão (Pergunta Inicial)
    return (
        <Container>
            <Card>
                <Title>Termo de aceite para Navegação</Title>
                <Text large>
                    A {operadora} solicita sua permissão para realizar contatos telefônicos 
                    com o objetivo de acompanhar a evolução do seu tratamento.
                </Text>
                <Text>Você aceita os termos para este acompanhamento?</Text>

                {/* ✅ Checkbox e Link para o PDF */}
                <CheckboxContainer>
                    <Checkbox 
                        id="aceite-termos"
                        checked={termosAceitos}
                        onChange={handleCheckboxChange}
                    />
                    <CheckboxLabel htmlFor="aceite-termos">
                        Aceito os{' '}
                        <TermLink 
                            href="/caminho/para/seu/termo-score.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            termos e condições
                        </TermLink>
                        {' '}para aplicação do score.
                    </CheckboxLabel>
                </CheckboxContainer>

                {/* Mensagem de erro que aparece só se tentar avançar sem marcar */}
                <ErrorMessage>
                    {erroCheckbox ? 'Por favor, aceite os termos antes de continuar.' : ''}
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