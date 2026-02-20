import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Container,
    Section,
    Header,
    ContentBox,
    Table,
    IconButton,
    TimelineRow,
    TimelineWrapper,
    TimelineItem,
    TimelineDot,
    TimelineContent,
    Toolbar,          // NOVO
    SearchInput,      // NOVO
    PaginationContainer, // NOVO
    PageButton        // NOVO
} from './styles';

export default function TimelinePacientes() {
    const [pacientesAgrupados, setPacientesAgrupados] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- NOVOS STATES PARA BUSCA E PAGINAÇÃO ---
    const [searchInput, setSearchInput] = useState(''); // O que o usuário digita
    const [termoBusca, setTermoBusca] = useState('');   // O termo aplicado após dar Enter
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Quantidade de pacientes por página

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/avaliacoes');
                const entrevistas = response.data;
                const grupos = {};

                // Agrupamento (Mantido igual ao anterior)
                entrevistas.forEach(ent => {
                    const paciente = ent.paciente;
                    if (!paciente) return;

                    if (!grupos[paciente.id]) {
                        grupos[paciente.id] = {
                            id: paciente.id,
                            nome: `${paciente.nome} ${paciente.sobrenome}`,
                            cpf: paciente.cpf,
                            celular: paciente.celular,
                            timeline: []
                        };
                    }

                    grupos[paciente.id].timeline.push({
                        id: `ent-${ent.id}`,
                        tipo: 'entrevista',
                        titulo: 'Entrevista Médica Realizada',
                        data: ent.createdAt,
                        detalhe: `Médico: ${ent.medico ? ent.medico.nome : 'Não informado'}`
                    });

                    if (ent.avaliacoes && ent.avaliacoes.length > 0) {
                        ent.avaliacoes.forEach(avaliacao => {
                            grupos[paciente.id].timeline.push({
                                id: `av-${avaliacao.id}`,
                                tipo: 'questionario',
                                titulo: `Questionário Respondido: ${avaliacao.template?.title || 'Template Padrão'}`,
                                data: avaliacao.createdAt,
                                detalhe: `Score Total: ${avaliacao.total_score}`
                            });
                        });
                    }
                });

                const listaFinal = Object.values(grupos).map(pac => {
                    pac.timeline.sort((a, b) => new Date(a.data) - new Date(b.data));
                    return pac;
                });

                // Ordenar a lista final por nome do paciente em ordem alfabética (Opcional, mas recomendado)
                listaFinal.sort((a, b) => a.nome.localeCompare(b.nome));

                setPacientesAgrupados(listaFinal);
            } catch (error) {
                console.error("Erro ao buscar dados da linha do tempo:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const toggleRow = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(data);
    };

    // ==========================================
    // LÓGICA DE BUSCA
    // ==========================================
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita que o formulário recarregue a página, caso exista um form em volta
            setTermoBusca(searchInput);
            setCurrentPage(1); // Volta para a primeira página ao fazer uma nova busca
        }
    };

    // Filtra os pacientes baseados no termo aplicado pelo Enter
    const pacientesFiltrados = pacientesAgrupados.filter(paciente => {
        if (!termoBusca) return true;
        const termo = termoBusca.toLowerCase();
        return (
            paciente.nome.toLowerCase().includes(termo) ||
            paciente.cpf.includes(termo) // Permite buscar por CPF também
        );
    });

    // ==========================================
    // LÓGICA DE PAGINAÇÃO
    // ==========================================
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Pega apenas a fatia (slice) de pacientes da página atual
    const pacientesAtuais = pacientesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pacientesFiltrados.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setExpandedId(null); // Fecha a linha do tempo aberta ao mudar de página
    };

    return (
        <Container>
            <Section>
                <Header>
                    <h1>Linha do Tempo dos Pacientes</h1>
                </Header>

                <ContentBox>
                    {/* BARRA DE FERRAMENTAS: BUSCA */}
                    <Toolbar>
                        <SearchInput
                            type="text"
                            placeholder="Digite o nome ou CPF e aperte Enter..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                            Total: {pacientesFiltrados.length} paciente(s)
                        </span>
                    </Toolbar>

                    {loading ? (
                        <p>Carregando pacientes...</p>
                    ) : (
                        <>
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}></th>
                                        <th>Paciente</th>
                                        <th>CPF</th>
                                        <th>Contato</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientesAtuais.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                Nenhum paciente encontrado para esta busca.
                                            </td>
                                        </tr>
                                    ) : (
                                        pacientesAtuais.map((paciente) => (
                                            <React.Fragment key={paciente.id}>
                                                {/* Linha Principal */}
                                                <tr className="main-row" onClick={() => toggleRow(paciente.id)}>
                                                    <td>
                                                        <IconButton $isExpanded={expandedId === paciente.id}>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="6 9 12 15 18 9"></polyline>
                                                            </svg>
                                                        </IconButton>
                                                    </td>
                                                    <td>{paciente.nome}</td>
                                                    <td>{paciente.cpf}</td>
                                                    <td>{paciente.celular}</td>
                                                    <td>
                                                        <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>
                                                            {paciente.timeline.length} registro(s)
                                                        </span>
                                                    </td>
                                                </tr>

                                                {/* Timeline Expansível */}
                                                {/* Timeline Expansível */}
                                                {expandedId === paciente.id && (
                                                    <TimelineRow>
                                                        <td colSpan="5" style={{ padding: 0 }}>
                                                            <TimelineWrapper>
                                                                {paciente.timeline.map((evento, index) => {
                                                                    // Como ordenamos do mais antigo pro mais novo, o último item do array é o "Estado Atual"
                                                                    const isUltimoEvento = index === paciente.timeline.length - 1;

                                                                    return (
                                                                        <TimelineItem key={evento.id}>
                                                                            {/* Passamos a prop $isCurrent que criamos no styled-components */}
                                                                            <TimelineDot $type={evento.tipo} $isCurrent={isUltimoEvento} />

                                                                            <TimelineContent $isCurrent={isUltimoEvento}>
                                                                                <strong>
                                                                                    {evento.titulo} {isUltimoEvento && <span style={{ fontSize: '0.75rem', color: '#28a745', marginLeft: '5px' }}>(Atual)</span>}
                                                                                </strong>
                                                                                <span>{formatarData(evento.data)} • {evento.detalhe}</span>
                                                                            </TimelineContent>
                                                                        </TimelineItem>
                                                                    );
                                                                })}
                                                            </TimelineWrapper>
                                                        </td>
                                                    </TimelineRow>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </Table>

                            {/* CONTROLES DE PAGINAÇÃO */}
                            {totalPages > 1 && (
                                <PaginationContainer>
                                    <PageButton
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </PageButton>

                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <PageButton
                                            key={index + 1}
                                            $active={currentPage === index + 1}
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </PageButton>
                                    ))}

                                    <PageButton
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próxima
                                    </PageButton>
                                </PaginationContainer>
                            )}
                        </>
                    )}
                </ContentBox>
            </Section>
        </Container>
    );
}