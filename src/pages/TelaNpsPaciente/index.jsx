import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api'; // Verifique se o caminho da sua API está correto
import {
  Container,
  Card,
  Header,
  Title,
  Subtitle,
  ScoreGrid,
  ScoreButton,
  Message,
  Spinner
} from './styles';

export default function TelaNpsPaciente() {
  const { id,paciente_id, monitoramento_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [jaRespondeu, setJaRespondeu] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  // 1. Busca os dados do paciente ao abrir o link
  useEffect(() => {
    async function fetchPaciente() {
      try {
        // Usa a nova rota passando os dois IDs
        const response = await api.get(`/nps/paciente/${paciente_id}/atendimento/${monitoramento_id}`);
        setPaciente(response.data.paciente);
        setJaRespondeu(response.data.ja_respondeu);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar os dados. O link pode estar inválido ou expirado.');
      } finally {
        setLoading(false);
      }
    }
    fetchPaciente();
  }, [id]);

  // 2. Função acionada quando o paciente clica em uma nota
  const handleScoreSelect = async (nota) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      // Salva a nota referenciando o monitoramento correto
      await api.post(`/nps/paciente/${paciente_id}/atendimento/${monitoramento_id}/responder`, { nota });
      setSucesso(true);
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao enviar sua nota. Por favor, tente novamente.');
      setSubmitting(false);
    }
  };

  // Renderização: Telas de Loading ou Erro
  if (loading) {
    return (
      <Container>
        <Spinner />
        <p style={{ marginTop: '15px', color: '#666' }}>Carregando pesquisa...</p>
      </Container>
    );
  }

  if (erro) {
    return (
      <Container>
        <Card>
          <Message error>Ops!</Message>
          <p>{erro}</p>
        </Card>
      </Container>
    );
  }

  if (jaRespondeu) {
    return (
      <Container>
        <Card>
          <Message>Obrigado!</Message>
          <p>Você já avaliou este atendimento recentemente. Agradecemos muito pelo seu feedback contínuo!</p>
        </Card>
      </Container>
    );
  }

  if (sucesso) {
    return (
      <Container>
        <Card>
          <Message success>Avaliação Registrada!</Message>
          <p>Sua nota foi enviada com sucesso. Muito obrigado por nos ajudar a melhorar o cuidado com você!</p>
          <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '20px' }}>
            Você já pode fechar esta página.
          </p>
        </Card>
      </Container>
    );
  }

  // Renderização: Tela Principal de Pesquisa
  return (
    <Container>
      <Card>
        <Header>
          {/* Se quiser, pode colocar a logo da clínica/agência aqui usando um <img src={logo} /> */}
          <Title>Pesquisa de Satisfação</Title>
        </Header>
        
        <Subtitle>
          Olá, <strong>{paciente?.nome}</strong>!<br />
          Em uma escala de 0 a 10, como você avalia o nosso atendimento hoje?
        </Subtitle>

        <ScoreGrid>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((nota) => (
            <ScoreButton
              key={nota}
              onClick={() => handleScoreSelect(nota)}
              disabled={submitting}
              nota={nota}
            >
              {nota}
            </ScoreButton>
          ))}
        </ScoreGrid>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.85rem', color: '#888' }}>
          <span>0 - Muito Insatisfeito</span>
          <span>10 - Muito Satisfeito</span>
        </div>
      </Card>
    </Container>
  );
}