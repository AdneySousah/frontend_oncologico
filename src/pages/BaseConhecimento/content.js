// Conteúdo da Base de Conhecimento. Cada tópico segue o mesmo formato,
// pra a tela renderizar de forma consistente independente da seção.
//
// Tipos de bloco de conteúdo:
//   texto       -> parágrafo simples
//   lista       -> lista com marcadores
//   passos      -> lista numerada (sequência de ações)
//   atencao     -> caixa de destaque (regra importante / cuidado)
//   dica        -> caixa de destaque (dica prática, tom mais leve)
//   ilustracao  -> mini recriação visual da tela real (ver ilustracoes.jsx)

export const topicos = [
  {
    id: 'dashboard',
    grupo: 'Operacional',
    titulo: 'Dashboard',
    corDestaque: '#337ab7',
    resumo: 'Painel consolidado de indicadores do mês: termos, aderência, avaliações, NPS e trocas de medicamento.',
    status: 'completo',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é',
        conteudo: 'É a tela inicial do sistema. Reúne, num só lugar, os principais números de acompanhamento dos pacientes num período: quantos termos foram aceitos/recusados, como está a aderência ao tratamento, quantas avaliações (questionários) foram concluídas, o resultado do NPS e o histórico de trocas de medicamento. Serve tanto pra acompanhamento do dia a dia quanto pra apresentação de resultados mensais pra operadora.'
      },
      { tipo: 'ilustracao', componente: 'dashboard' },
      {
        tipo: 'lista',
        titulo: 'O que cada indicador mostra',
        itens: [
          'Termos — quantos pacientes aceitaram, recusaram ou ainda estão com o termo pendente no período.',
          'Aderência (categoria e score) — como os pacientes estão respondendo ao tratamento, agrupado por nível de aderência.',
          'Ficha RAM — reações adversas registradas no período.',
          'Pacientes sincronizados x monitorados — quantos pacientes vieram do sistema externo versus quantos efetivamente entraram em acompanhamento de telemonitoramento.',
          'NPS — nota de satisfação média e a distribuição de notas.',
          'Histórico de trocas — todas as vezes que um medicamento foi substituído durante o acompanhamento, com o motivo.'
        ]
      },
      {
        tipo: 'passos',
        titulo: 'Como filtrar o período',
        itens: [
          'Escolha a operadora no seletor superior — ou deixe em branco pra ver a visão consolidada de todas.',
          'Escolha a data de início e fim do período que quer analisar.',
          'Os gráficos e números recalculam automaticamente conforme o filtro muda.'
        ]
      },
      {
        tipo: 'atencao',
        titulo: 'Meses fechados não mudam mais',
        conteudo: 'Todo dia 3 do mês, o sistema "congela" automaticamente o mês anterior: ele salva uma fotografia exata dos números daquele mês e passa a servir sempre essa fotografia, mesmo que dados novos cheguem depois. Isso existe pra garantir que um relatório já apresentado pra operadora nunca mude sozinho debaixo do seu pé. Se for realmente necessário recalcular um mês já fechado (por exemplo, depois de corrigir um dado que estava errado), isso só pode ser feito manualmente, via chamada direta à rota de fechamento — não existe botão pra isso na tela ainda. Fale com o time técnico se precisar recalcular um mês específico.'
      },
      {
        tipo: 'dica',
        titulo: 'Por que reiniciar o sistema não duplica nada',
        conteudo: 'O fechamento automático de mês roda toda vez que o servidor sobe, além de rodar todo dia às 3h da manhã. Isso é proposital e seguro: antes de fechar qualquer mês, o sistema verifica se aquele mês (pra aquela operadora) já foi fechado antes — se já foi, ele pula e não faz nada. Reiniciar o backend não recalcula nem duplica meses que já estão fechados.'
      }
    ]
  },

  {
    id: 'necessidade-navegacao',
    grupo: 'Operacional',
    titulo: 'Necessidade de Navegação',
    corDestaque: '#337ab7',
    resumo: 'Onde entram os pacientes sincronizados do sistema externo, pra decidir envio de termo, questionário e início do acompanhamento contínuo.',
    status: 'completo',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é',
        conteudo: 'É a porta de entrada de todo paciente novo no sistema. Não existe cadastro manual de paciente — todos chegam via sincronização com o sistema externo. Aqui é onde o time decide, pra cada paciente, o que fazer em seguida: enviar o termo de aceite, avançar pro questionário, ou pausar o tratamento.'
      },
      { tipo: 'ilustracao', componente: 'necessidade-navegacao' },
      {
        tipo: 'passos',
        titulo: 'O fluxo completo de um paciente',
        itens: [
          'Sincronização — o paciente e seus eventos de compra de medicamento chegam do sistema externo (automaticamente ou pelo botão "Sincronizar").',
          'Termo de aceite — o sistema oferece 5 formas de enviar o link do termo: WhatsApp pro paciente, WhatsApp pro cuidador, WhatsApp em número digitado manualmente, e-mail, ou apenas gerar e copiar o link pra enviar manualmente por fora (esse último não dispara nada automaticamente).',
          'Aceite do paciente — o paciente responde pelo link. Status vira "Aceito", "Recusado" ou continua "Pendente".',
          'Questionário — com o termo aceito, o botão da linha muda pra "Avaliar" e abre o questionário de avaliação.',
          'Configuração de uso contínuo — depois do questionário, se aplicável, entra a tela de configurar posologia e data de início do(s) medicamento(s), o que efetivamente inicia o acompanhamento no Telemonitoramento.'
        ]
      },
      {
        tipo: 'atencao',
        titulo: 'O botão "Sincronizar" e os pendentes',
        conteudo: 'O contador de pendências no topo da tela soma pacientes novos que ainda não existem no sistema local e eventos de compra novos de pacientes que já existem. Quando a sincronização termina, se algum paciente não sincronizar, um painel aparece embaixo do botão mostrando exatamente quem falhou e por quê — em português, com o nome do medicamento e o ID do evento no sistema externo, pra localizar lá se precisar corrigir. Não é mais necessário chamar o time técnico pra traduzir um erro cru de banco de dados.'
      },
      {
        tipo: 'lista',
        titulo: 'Quem entra na sincronização (regras aplicadas automaticamente)',
        itens: [
          'Só pacientes com o tipo de tratamento "Navegação Oncológica" (id 4) no sistema externo.',
          'Só eventos de compra do tipo correto, com medicamento efetivamente recebido.',
          'Pacientes da operadora bloqueada ("Fundação Libertas") são ignorados — regra de negócio fixada no sistema.'
        ]
      },
      {
        tipo: 'texto',
        titulo: 'Pausar tratamento',
        conteudo: 'Ao lado das opções de enviar termo, existe "Pausar Tratamento" — uma terceira ação pra quando o paciente não pode ser contatado por um período (por exemplo, internação). Ao pausar, é obrigatório escolher um motivo de uma lista pré-cadastrada (a mesma lista usada em "Descontinuar Medicamento" no Telemonitoramento, pra manter os motivos contabilizáveis em um só lugar). Enquanto pausado, o paciente fica com um selo roxo "Tratamento Pausado" na tela, some das pendências do Telemonitoramento, e o sistema bloqueia qualquer contato automatizado — envio de termo, envio de NPS e mensagens de chat — até alguém retomar o tratamento manualmente pelo botão ao lado.'
      },
      {
        tipo: 'dica',
        titulo: 'Motivos de pausa/descontinuação são gerenciáveis',
        conteudo: 'A lista de motivos (tanto pra pausar quanto pra descontinuar) fica em Tabelas Cadastrais → Motivos de Pausa/Descontinuação. Pode adicionar, editar ou inativar motivos por lá sem precisar de ajuda técnica.'
      }
    ]
  },

  {
    id: 'telemonitoramento',
    grupo: 'Operacional',
    titulo: 'Telemonitoramento',
    corDestaque: '#337ab7',
    resumo: 'Fila de contatos pendentes com pacientes em acompanhamento contínuo de medicamento.',
    status: 'completo',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é',
        conteudo: 'É onde acontece o acompanhamento periódico de cada paciente enquanto ele está usando um medicamento. Cada linha da fila representa um paciente com um contato pendente — a lista é ordenada automaticamente pela data do próximo contato, do mais urgente pro mais distante.'
      },
      { tipo: 'ilustracao', componente: 'telemonitoramento' },
      {
        tipo: 'passos',
        titulo: 'Registrando um contato',
        itens: [
          'Clique em "Registrar Contato" na linha do paciente. Se o contato não foi bem-sucedido (paciente não atendeu), o sistema pede o motivo antes de continuar — motivo esse vindo de uma lista cadastrável em Tabelas Cadastrais → Falhas de Contato.',
          'Informe quantos comprimidos restaram na caixa e o nível de adesão do paciente ao tratamento.',
          'Se o paciente relatou reação adversa, marque e selecione qual(is).',
          'Se a posologia mudou no meio do ciclo, é possível registrar isso também, com a data em que passou a valer.',
          'O sistema verifica automaticamente se já chegou uma nova compra desse medicamento (ou de outro, indicando troca) — se detectar, mostra os detalhes e pergunta se aplica.',
          'Se o paciente descontinuou o medicamento, marque "Descontinuar" — isso encerra o ciclo e não agenda um próximo, exigindo motivo estruturado (mesma lista da "Pausar Tratamento").'
        ]
      },
      {
        tipo: 'atencao',
        titulo: 'Uso em conjunto de dois medicamentos',
        conteudo: 'Quando um paciente está usando dois medicamentos simultaneamente (uso conjunto), o registro de contato passa a ser feito num assistente com uma etapa pra cada medicamento, garantindo que os dois ciclos fiquem alinhados na mesma rodada.'
      },
      {
        tipo: 'texto',
        titulo: 'Reembolso não sai da fila',
        conteudo: 'Pacientes com eventos de reembolso (o medicamento foi comprado pelo próprio paciente e reembolsado depois, sem passar pela compra normal pela operadora) continuam aparecendo normalmente nesta fila — eles ainda precisam de acompanhamento. A única diferença é que esse ciclo específico não entra na cobrança do Faturamento.'
      }
    ]
  },

  {
    id: 'linha-do-tempo',
    grupo: 'Operacional',
    titulo: 'Linha do Tempo',
    corDestaque: '#337ab7',
    resumo: 'Histórico cronológico completo de um paciente — todos os contatos, avaliações e mudanças.',
    status: 'completo',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é',
        conteudo: 'É a visão consolidada de tudo que já aconteceu com um paciente desde que ele entrou no sistema: aceite do termo, avaliações respondidas, início e fim de cada ciclo de medicamento, trocas de medicamento e descontinuações — tudo em ordem cronológica, num único lugar.'
      },
      { tipo: 'ilustracao', componente: 'linha-do-tempo' },
      {
        tipo: 'lista',
        titulo: 'Pra que serve',
        itens: [
          'Entender rapidamente o histórico de um paciente sem precisar abrir várias telas separadas.',
          'Conferir quando e por que um medicamento foi trocado ou descontinuado.',
          'Ver a evolução das notas de avaliação e NPS ao longo do tempo.',
          'Auditar o atendimento de um paciente específico, ponto a ponto.'
        ]
      },
      {
        tipo: 'dica',
        titulo: 'Busca por paciente',
        conteudo: 'Use a busca no topo da tela pra encontrar rapidamente o paciente pelo nome. A linha do tempo carrega automaticamente todo o histórico assim que ele é selecionado.'
      }
    ]
  },

  {
    id: 'recalculo',
    grupo: 'Operacional',
    titulo: 'Recálculo',
    corDestaque: '#337ab7',
    resumo: 'Corrige posologia e data de início cadastradas erradas, sem passar pelo fluxo de contato.',
    status: 'completo',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é',
        conteudo: 'Existe pra corrigir um erro pontual: se a posologia ou a data de início de um medicamento foram cadastradas erradas na "configuração de uso contínuo" (a etapa que acontece logo depois do questionário, em Necessidade de Navegação), essa tela permite corrigir sem precisar simular um contato inteiro no Telemonitoramento.'
      },
      { tipo: 'ilustracao', componente: 'recalculo' },
      {
        tipo: 'atencao',
        titulo: 'Só funciona no primeiro ciclo',
        conteudo: 'Essa é a regra mais importante desta tela: só aparecem aqui pacientes que estão no PRIMEIRO ciclo de um medicamento — ou seja, nenhum registro anterior (concluído, descontinuado, seja qual for o status) existe pra aquele mesmo par paciente+medicamento. Depois que o primeiro ciclo termina (o paciente já teve pelo menos um contato registrado), qualquer ajuste de posologia passa a ser feito pelo fluxo normal de "Registrar Contato" no Telemonitoramento — essa tela não serve mais pra esse medicamento específico. Essa restrição é validada também no servidor, então não tem como contornar pela tela.'
      },
      {
        tipo: 'passos',
        titulo: 'Como recalcular',
        itens: [
          'Encontre o paciente na lista (só aparecem os elegíveis — se não encontrar alguém, é porque ele não está mais no primeiro ciclo).',
          'Clique em "Recalcular".',
          'Corrija a posologia (comprimidos por dia) e/ou a data de início.',
          'Confirme — o sistema recalcula automaticamente a data prevista de fim da caixa e a data do próximo contato a partir dos novos valores.'
        ]
      }
    ]
  },

  {
    id: 'faturamento',
    grupo: 'Administrativo',
    titulo: 'Faturamento',
    corDestaque: '#5cb85c',
    resumo: 'Consolidação financeira mensal de medicamentos acompanhados por paciente.',
    status: 'completo',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é',
        conteudo: 'Reúne o valor de cada medicamento acompanhado por paciente num período, servindo de base pra cobrança das operadoras. Os valores vêm do preço registrado em cada evento de compra sincronizado do sistema externo.'
      },
      { tipo: 'ilustracao', componente: 'faturamento' },
      {
        tipo: 'passos',
        titulo: 'Como consultar',
        itens: [
          'Filtre por operadora e período no topo da tela.',
          'Os cards de resumo mostram o total do período e a quantidade de pacientes faturados.',
          'A tabela abaixo detalha paciente por paciente, com o medicamento e o valor correspondente.'
        ]
      },
      {
        tipo: 'atencao',
        titulo: 'Reembolso não entra na cobrança',
        conteudo: 'Ciclos de medicamento marcados como reembolso (o paciente comprou por conta própria e foi reembolsado, sem passar pela compra normal via operadora) são automaticamente excluídos do Faturamento — mesmo que o paciente continue aparecendo normalmente no Telemonitoramento pra acompanhamento.'
      }
    ]
  },

  {
    id: 'auditoria',
    grupo: 'Administrativo',
    titulo: 'Auditoria',
    corDestaque: '#5cb85c',
    resumo: 'Registro de quem fez o quê no sistema — criações, edições, exclusões e envios.',
    status: 'completo',
    secoes: [
      {
        tipo: 'texto',
        titulo: 'O que é',
        conteudo: 'É o histórico de ações relevantes realizadas no sistema: quem criou, editou ou apagou o quê, e quando. Serve tanto pra rastrear uma mudança específica quanto pra ter um registro formal de responsabilidade sobre ações administrativas e clínicas.'
      },
      { tipo: 'ilustracao', componente: 'auditoria' },
      {
        tipo: 'lista',
        titulo: 'O que é registrado',
        itens: [
          'Usuários, Perfis e Operadoras — criação, edição e ativação/desativação.',
          'Especialidades, Reação Adversa, Motivos de Falha de Contato e de Pausa/Descontinuação, Questionários — mudanças no cadastro.',
          'Pacientes — criação/atualização via sincronização, pausa e retomada de tratamento.',
          'Monitoramento — descontinuação de medicamento, recálculo de posologia/data.',
          'Termo — envio (WhatsApp, e-mail ou link manual) e criação de nova versão do texto.',
          'NPS — envio e inserção manual de nota.',
          'Chat — envio de mensagem e reabertura de janela de 24h.',
          'Sessão — login realizado.',
          'Senha — redefinição via "esqueci minha senha".'
        ]
      },
      {
        tipo: 'dica',
        titulo: 'O que não é registrado (de propósito)',
        conteudo: 'Ações puramente de leitura (abrir uma tela, consultar um relatório) e mecanismos técnicos internos (como o lock que evita dois atendentes editando o mesmo paciente ao mesmo tempo) não geram registro de auditoria — isso é proposital, pra manter o histórico focado em ações que realmente importam, sem virar um registro poluído de cliques.'
      },
      {
        tipo: 'passos',
        titulo: 'Como pesquisar',
        itens: [
          'Use os filtros no topo pra restringir por usuário, tipo de ação ou período.',
          'Cada linha mostra quem fez, o que fez, em qual registro, e quando.'
        ]
      }
    ]
  }
];
