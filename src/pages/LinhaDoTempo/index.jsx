import React, { useState, useEffect } from 'react';
import api from '../../services/api';
// IMPORTANTE: Ajuste o caminho abaixo conforme a estrutura de pastas do seu projeto
import { exportToXLSX } from '../../utils/exportExcel'; 
import {
    Container,
    Section,
    Header,
    ContentBox,
    Table,
    IconButton,
    ExportButton, // <-- Novo styled component importado
    TimelineRow,
    TimelineWrapper,
    TimelineItem,
    TimelineDot,
    TimelineContent,
    Toolbar,
    SearchInput,
    PaginationContainer,
    PageButton
} from './styles';

export default function TimelinePacientes() {
    const [pacientesAgrupados, setPacientesAgrupados] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA BUSCA E PAGINAÇÃO ---
    const [searchInput, setSearchInput] = useState(''); 
    const [termoBusca, setTermoBusca] = useState('');   
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    useEffect(() => {
        async function fetchData() {
            try {
                const [respPacientes, respMonitoramento] = await Promise.all([
                    api.get('/avaliacoes'),
                    api.get('/monitoramento/timeline')
                ]);

                const pacientesList = respPacientes.data;
                const monitoramentos = respMonitoramento.data;
                const grupos = {};

                // 1. Processar Pacientes e Avaliações (Questionários de Navegação)
                pacientesList.forEach(paciente => {
                    if (!grupos[paciente.id]) {
                        grupos[paciente.id] = {
                            id: paciente.id,
                            nome: `${paciente.nome} ${paciente.sobrenome}`,
                            cpf: paciente.cpf || '-',
                            celular: paciente.celular || paciente.telefone || '-',
                            operadora: paciente.operadoras ? paciente.operadoras.nome : 'N/A',
                            timeline: []
                        };
                    }

                    if (paciente.avaliacoes && paciente.avaliacoes.length > 0) {
                        paciente.avaliacoes.forEach(avaliacao => {
                            grupos[paciente.id].timeline.push({
                                id: `av-${avaliacao.id}`,
                                tipo: 'questionario',
                                titulo: `Questionário: ${avaliacao.template?.title || 'Avaliação de Necessidade'}`,
                                data: avaliacao.createdAt,
                                detalhe: `Score Calculado: ${avaliacao.total_score} pts`,
                                status: 'CONCLUIDO'
                            });
                        });
                    }
                });

                // 2. Processar Monitoramentos (Contatos Realizados e Futuros)
                monitoramentos.forEach(mon => {
                    const pacId = mon.paciente ? mon.paciente.id : mon.paciente_id;
                    
                    if (!grupos[pacId]) {
                        grupos[pacId] = {
                            id: pacId,
                            nome: mon.paciente ? `${mon.paciente.nome} ${mon.paciente.sobrenome}` : 'Paciente Não Identificado',
                            cpf: '-',
                            celular: '-',
                            operadora: 'N/A',
                            timeline: []
                        };
                    }

                    const isFuturo = mon.status === 'PENDENTE';
                    
                    grupos[pacId].timeline.push({
                        id: `mon-${mon.id}`,
                        tipo: 'monitoramento',
                        titulo: isFuturo ? `Próximo Contato Agendado` : `Monitoramento Realizado`,
                        data: isFuturo ? mon.data_proximo_contato : mon.updatedAt,
                        detalhe: `Medicamento: ${mon.medicamento?.nome || 'N/I'} | Posologia: ${mon.posologia_diaria || '-'}`,
                        status: mon.status
                    });
                });

                const listaFinal = Object.values(grupos).map(pac => {
                    pac.timeline.sort((a, b) => new Date(a.data) - new Date(b.data));
                    return pac;
                });

                listaFinal.sort((a, b) => a.nome.localeCompare(b.nome));
                setPacientesAgrupados(listaFinal);
            } catch (error) {
                console.error("Erro ao carregar dados da timeline:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const toggleRow = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // --- FUNÇÃO DE DATA PARA O EXCEL (Data absoluta, sem termos como "Amanhã") ---
    const formatarDataParaExcel = (dataString) => {
        if (!dataString) return '-';
        const isApenasData = dataString.length === 10;
        const data = isApenasData ? new Date(`${dataString}T12:00:00`) : new Date(dataString);
        
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: isApenasData ? undefined : '2-digit',
            minute: isApenasData ? undefined : '2-digit'
        }).format(data);
    };

    // --- NOVA FUNÇÃO DE DATA AMIGÁVEL (Tela) ---
    const formatarDataAmigavel = (dataString) => {
        if (!dataString) return '-';
        const isApenasData = dataString.length === 10;
        const data = isApenasData ? new Date(`${dataString}T12:00:00`) : new Date(dataString);
        const agora = new Date();
        const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const dataEvento = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        const diffTime = dataEvento - hoje;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

        const horaFormatada = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(data);
        const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(data);

        if (diffDays > 0) {
            if (diffDays === 1) return isApenasData ? 'Amanhã' : `Amanhã às ${horaFormatada}`;
            if (diffDays <= 7) return isApenasData ? `Em ${diffDays} dias` : `Em ${diffDays} dias às ${horaFormatada}`;
            return isApenasData ? `${dataCurta}` : `${dataCurta} às ${horaFormatada}`;
        }

        if (diffDays === 0) {
            return isApenasData ? 'Hoje' : `Hoje às ${horaFormatada}`;
        } else if (diffDays === -1) {
            return isApenasData ? 'Ontem' : `Ontem às ${horaFormatada}`;
        } else if (diffDays >= -7) {
            return isApenasData ? `Há ${Math.abs(diffDays)} dias` : `Há ${Math.abs(diffDays)} dias às ${horaFormatada}`;
        } else {
            const dataCompleta = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(data);
            return isApenasData ? dataCompleta : `${dataCompleta} às ${horaFormatada}`;
        }
    };

    // --- LÓGICA DE EXPORTAÇÃO PARA EXCEL ---
    const handleExportarExcel = async (e, paciente) => {
        e.stopPropagation(); // Impede que a linha expanda ao clicar no botão de download

        if (!paciente.timeline || paciente.timeline.length === 0) {
            alert("Não há eventos registrados para este paciente.");
            return;
        }

        const columns = [
            { header: "Data", key: "data", width: 20 },
            { header: "Tipo de Evento", key: "tipo", width: 20 },
            { header: "Título", key: "titulo", width: 40 },
            { header: "Detalhes", key: "detalhe", width: 50 },
            { header: "Status", key: "status", width: 15 },
        ];

        const dataToExport = paciente.timeline.map(evento => ({
            data: formatarDataParaExcel(evento.data),
            tipo: evento.tipo.toUpperCase(),
            titulo: evento.titulo,
            detalhe: evento.detalhe,
            status: evento.status
        }));

        const nomeArquivo = `Timeline_${paciente.nome.replace(/\s+/g, '_')}`;
        const tituloRelatorio = `Linha do Tempo - ${paciente.nome} (CPF: ${paciente.cpf})`;

        await exportToXLSX(dataToExport, columns, nomeArquivo, tituloRelatorio);
    };

    // --- LÓGICA DE BUSCA ---
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setTermoBusca(searchInput);
            setCurrentPage(1);
        }
    };

    const pacientesFiltrados = pacientesAgrupados.filter(paciente => {
        if (!termoBusca) return true;
        const termo = termoBusca.toLowerCase();
        return (
            paciente.nome.toLowerCase().includes(termo) ||
            paciente.cpf.includes(termo) ||
            paciente.operadora.toLowerCase().includes(termo)
        );
    });

    // --- PAGINAÇÃO ---
    const totalPages = Math.ceil(pacientesFiltrados.length / itemsPerPage);
    const pacientesAtuais = pacientesFiltrados.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    return (
        <Container>
            <Section>
                <Header>
                    <h1>Linha do Tempo dos Pacientes</h1>
                </Header>

                <ContentBox>
                    <Toolbar>
                        <SearchInput
                            type="text"
                            placeholder="Busque por Nome, CPF ou Operadora e aperte Enter..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                            Total: {pacientesFiltrados.length} paciente(s)
                        </span>
                    </Toolbar>

                    {loading ? (
                        <p style={{ padding: '20px', textAlign: 'center' }}>Carregando dados da timeline...</p>
                    ) : (
                        <>
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}></th>
                                        <th>Paciente</th>
                                        <th>CPF</th>
                                        <th>Operadora</th>
                                        <th>Eventos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientesAtuais.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                Nenhum paciente encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        pacientesAtuais.map((paciente) => (
                                            <React.Fragment key={paciente.id}>
                                                <tr className="main-row" onClick={() => toggleRow(paciente.id)}>
                                                    <td>
                                                        <IconButton $isExpanded={expandedId === paciente.id}>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="6 9 12 15 18 9"></polyline>
                                                            </svg>
                                                        </IconButton>
                                                    </td>
                                                    <td><strong>{paciente.nome}</strong></td>
                                                    <td>{paciente.cpf}</td>
                                                    <td>
                                                        <span style={{ background: '#e3f2fd', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#1976d2', fontWeight: 'bold' }}>
                                                            {paciente.operadora}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {/* --- CÉLULA DE EVENTOS ATUALIZADA COM BOTÃO --- */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <span>{paciente.timeline.length} registro(s)</span>
                                                            <ExportButton 
                                                                onClick={(e) => handleExportarExcel(e, paciente)}
                                                                title="Baixar linha do tempo em Excel"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                </svg>
                                                            </ExportButton>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {expandedId === paciente.id && (
                                                    <TimelineRow>
                                                        <td colSpan="5" style={{ padding: 0 }}>
                                                            <TimelineWrapper>
                                                                {paciente.timeline.length === 0 ? (
                                                                    <p style={{ padding: '20px', color: '#888' }}>Sem eventos registrados.</p>
                                                                ) : (
                                                                    paciente.timeline.map((evento, index) => {
                                                                        const isUltimo = index === paciente.timeline.length - 1;
                                                                        const isFuturo = new Date(evento.data) > new Date();

                                                                        return (
                                                                            <TimelineItem key={evento.id}>
                                                                                <TimelineDot 
                                                                                    $type={evento.tipo} 
                                                                                    $isCurrent={isUltimo}
                                                                                    style={isFuturo ? { backgroundColor: '#ffa000' } : {}}
                                                                                />
                                                                                <TimelineContent $isCurrent={isUltimo}>
                                                                                    <strong>
                                                                                        {evento.titulo} {isFuturo && <small style={{color: '#ef6c00'}}> (AGENDADO)</small>}
                                                                                    </strong>
                                                                                    <span>{formatarDataAmigavel(evento.data)} • {evento.detalhe}</span>
                                                                                </TimelineContent>
                                                                            </TimelineItem>
                                                                        );
                                                                    })
                                                                )}
                                                            </TimelineWrapper>
                                                        </td>
                                                    </TimelineRow>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </Table>

                            {totalPages > 1 && (
                                <PaginationContainer>
                                    <PageButton 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >Anterior</PageButton>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <PageButton 
                                            key={i} 
                                            $active={currentPage === i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >{i + 1}</PageButton>
                                    ))}

                                    <PageButton 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >Próxima</PageButton>
                                </PaginationContainer>
                            )}
                        </>
                    )}
                </ContentBox>
            </Section>
        </Container>
    );
}