// Conteúdo do Manual do Sistema. Ao mudar um fluxo de tela, atualize o tópico correspondente.
export const grupos = [
  { id: 'inicio', titulo: 'Primeiros passos' },
  { id: 'jornada', titulo: 'Jornada do paciente' },
  { id: 'atendimento', titulo: 'Atendimento' },
  { id: 'cadastros', titulo: 'Tabelas cadastrais' },
  { id: 'admin', titulo: 'Administrativo' },
  { id: 'duvidas', titulo: 'Dúvidas frequentes' },
];

export const topicos = [
  // ===================================================================
  // PRIMEIROS PASSOS
  // ===================================================================
  {
    id: 'entrar-no-sistema',
    grupo: 'inicio',
    titulo: 'Entrar no sistema',
    icone: 'LuLogIn',
    caminho: null,
    quem: 'Todos os usuários',
    resumo: 'Você entra com o mesmo usuário e a mesma senha que já usa no sistema de compras da empresa.',
    palavrasChave: ['login', 'senha', 'acesso', 'entrar', 'usuário', 'lembrar meu usuário', 'recuperar senha', 'primeiro acesso'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Qual usuário e senha usar',
        conteudo: 'O Onco Navegação não tem senha própria. Você entra com o usuário e a senha do sistema de compras da empresa. No campo de usuário, a tela mostra a dica **Usuario utilizado no sistema de compras**. Você pode digitar o nome de usuário ou o e-mail.',
      },
      {
        tipo: 'passos',
        titulo: 'Como entrar',
        itens: [
          'Abra o endereço do sistema. Você vê a tela **Seja bem vindo**.',
          'Digite seu usuário do sistema de compras.',
          'Digite sua senha. Clique no ícone de olho para ver o que digitou.',
          'Marque **Lembrar meu usuário** para o campo de usuário já vir preenchido na próxima vez. A senha não fica guardada pelo sistema: se quiser, deixe o próprio navegador salvá-la quando ele oferecer.',
          'Clique em **Entrar**. Você é levado ao Dashboard.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'O que acontece no seu primeiro login',
        conteudo: 'No primeiro login, o sistema cria seu cadastro automaticamente, com um perfil inicial de permissões. A operadora ligada ao seu usuário vem do sistema de compras e é atualizada a cada login. Se você não enxerga alguma tela de que precisa, peça ao administrador para ajustar seu perfil em **Usuários**.',
      },
      {
        tipo: 'atencao',
        titulo: 'Esqueceu a senha ou quer trocar?',
        conteudo: 'Troque ou recupere a senha no sistema de compras. A senha nova vale aqui na mesma hora. As telas **Recuperar Senha** e **Defina sua nova senha** deste sistema não mudam a senha usada para entrar.',
      },
      {
        tipo: 'dica',
        titulo: 'Computador compartilhado',
        conteudo: 'Em computador usado por outras pessoas, não marque **Lembrar meu usuário** e não deixe o navegador salvar sua senha. Ao terminar, clique em **Sair do Sistema**, no rodapé do menu.',
      },
      {
        tipo: 'faq',
        itens: [
          { pergunta: 'Apareceu "Usuário e/ou senha incorretos." O que faço?', resposta: 'Confira se você consegue entrar no sistema de compras com os mesmos dados. Se lá também não funcionar, o problema está no seu usuário do sistema de compras.' },
          { pergunta: 'Posso usar o tema escuro já na tela de login?', resposta: 'Sim. Clique em **Modo Escuro**, no canto da tela de login.' },
        ],
      },
    ],
  },

  {
    id: 'navegar-no-sistema',
    grupo: 'inicio',
    titulo: 'Navegar pelo sistema',
    icone: 'LuMenu',
    caminho: null,
    quem: 'Todos os usuários',
    resumo: 'Como usar o menu lateral, recolher o menu, abrir o menu no celular, trocar o tema e sair.',
    palavrasChave: ['menu', 'sidebar', 'celular', 'modo escuro', 'tema', 'sair', 'perfil', 'permissão', 'status nps', 'whatsapp', 'saldo'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'O menu lateral',
        conteudo: 'No topo do menu você vê suas iniciais, seu nome e sua operadora. Usuários da CIC Farma veem **CICFARMA**. Abaixo ficam o item **Alertas** e três grupos que abrem e fecham com um clique: **Atendimento**, **Tabelas Cadastrais** e **Administrativo**. O grupo **Atendimento** já vem aberto.',
      },
      {
        tipo: 'lista',
        titulo: 'O que tem em cada grupo',
        itens: [
          '**Atendimento**: Dashboard, Necessidade de Navegação, Telemonitoramento, Linha do Tempo e Recálculo.',
          '**Tabelas Cadastrais**: Operadoras, Usuários, Permissões, Questionários, Ficha RAM, Falhas de Contato e Motivos de Pausa/Descontinuação.',
          '**Administrativo**: Auditoria, Faturamento e Termos Assinados.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Cada usuário vê um menu diferente',
        conteudo: 'O menu mostra só as telas liberadas no seu perfil de permissões. Se um grupo inteiro não aparece, você não tem acesso a nenhuma tela dele. Quem define isso é o administrador, na tela **Permissões**.',
      },
      {
        tipo: 'passos',
        titulo: 'Recolher e abrir o menu no computador',
        itens: [
          'Clique na setinha na borda do menu para recolhê-lo. Ficam só os ícones e sobra mais espaço para as tabelas.',
          'Clique de novo na setinha para abrir o menu.',
          'Com o menu recolhido, clicar em um grupo abre o menu automaticamente.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Usar o menu no celular',
        itens: [
          'Toque no botão **☰**, no topo da tela, ao lado de **Onco Navegação**.',
          'Escolha a tela. O menu fecha sozinho.',
          'Para fechar sem escolher nada, toque na área escura fora do menu.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Rodapé do menu',
        itens: [
          '**Status NPS (WhatsApp)**: mostra a qualidade do número de WhatsApp usado nos envios (**Qualidade Alta**, **Qualidade Média**, **Qualidade Baixa** ou **Indisponível**) e o **Saldo** disponível. Só aparece para administradores e para perfis com o módulo **Saúde do NPS**.',
          '**Modo Escuro** / **Modo Claro**: troca o tema das telas.',
          '**Sair do Sistema**: encerra sua sessão.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Botões flutuantes no canto da tela',
        conteudo: 'No canto inferior da tela podem aparecer dois botões: o roxo, da caixa de **Notificações**, e o verde, do **chat de pacientes**. Veja os tópicos próprios de cada um.',
      },
    ],
  },

  {
    id: 'alertas',
    grupo: 'inicio',
    titulo: 'Alertas',
    icone: 'LuBell',
    caminho: null,
    quem: 'Quem tem acesso a Telemonitoramento, Questionários e Avaliações ou Pacientes',
    resumo: 'O sino do menu reúne os contatos que vencem nos próximos dias, os questionários a renovar e as pausas de medicamento perto do fim.',
    palavrasChave: ['sino', 'alerta', 'pendências', 'vencido', 'atrasado', 'urgência', 'score', 'risco'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Para que serve',
        conteudo: 'O item **Alertas (N)** do menu mostra quantas pendências estão perto de vencer. A cor do sino indica a urgência: vermelho quando algo vence em até 1 dia ou já atrasou, amarelo quando o mais urgente vence em até 3 dias, e verde nos demais casos. A contagem é atualizada a cada 5 minutos e também depois que você registra um contato ou uma avaliação.',
      },
      {
        tipo: 'lista',
        titulo: 'Tipos de alerta',
        itens: [
          '**Telemonitoramento**: contato agendado que vence em até 5 dias ou que já está atrasado. Mostra o medicamento.',
          '**Avaliação**: questionário que precisa ser renovado. Cada questionário vale 6 meses, e o alerta aparece 5 dias antes do vencimento.',
          '**Pausa de Medicamento**: medicamento pausado cuja retomada prevista é em até 2 dias. Além do sino, aparece um aviso na tela. Clique no aviso para ir à lista de pausados.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Como usar a janela de alertas',
        itens: [
          'Clique em **Alertas** no menu. Abre a janela **Contatos Pendentes**.',
          'Use os botões **Todos**, **Tele** e **Avaliações** para filtrar.',
          'Clique em **Por Data (Urgência)** para trocar para **Por Risco (Score)**. Assim os pacientes com maior pontuação no questionário sobem para o topo.',
          'Em cada cartão, veja o paciente, o tipo, o score e o prazo: **Atrasado há X dias**, **Vence Hoje** ou **Vence em X dias**.',
          'Clique em **Ir** para abrir a tela certa já no paciente.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Pausas só aparecem em Todos',
        conteudo: 'A janela não tem um filtro próprio para **Pausa de Medicamento**. Para ver esses alertas, deixe o filtro em **Todos**.',
      },
      {
        tipo: 'dica',
        titulo: 'Paciente não aparece nos alertas?',
        conteudo: 'Pacientes com o tratamento pausado não geram alertas de contato. O sino também só conta contatos que vencem em até 5 dias.',
      },
    ],
  },

  {
    id: 'caixa-de-notificacoes',
    grupo: 'inicio',
    titulo: 'Caixa de notificações',
    icone: 'LuBell',
    caminho: null,
    quem: 'Quem envia termos e pesquisas de NPS',
    resumo: 'O botão roxo avisa quando um paciente aceita o termo ou responde a pesquisa de satisfação enquanto você faz outra coisa.',
    palavrasChave: ['notificações', 'caixa', 'botão roxo', 'termo aceito', 'nps respondido', 'segundo plano', '2º plano'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Para que serve',
        conteudo: 'Quando você coloca um termo ou um NPS **em 2º plano**, não precisa ficar esperando a resposta na tela. Quando o paciente responde, o aviso cai na caixa de **Notificações**. O botão roxo só aparece quando há algum aviso, com um número indicando quantos são.',
      },
      {
        tipo: 'lista',
        titulo: 'Tipos de aviso',
        itens: [
          '**Termo aceito**: mostra o nome do paciente e a frase **Aceitou o termo e aguarda contato.** Clique em **Fazer questionário agora** para abrir o questionário dele.',
          '**NPS respondido**: mostra **Respondeu a pesquisa de satisfação. Nota: X**. Clique em **Ciente, remover** para apagar o aviso.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Quando o aviso do termo chega',
        conteudo: 'O sistema confere os termos em 2º plano enquanto a tela **Necessidade de Navegação** está aberta. Se você sair dela, o aviso chega quando você voltar. A recusa do termo não vai para a caixa: aparece só um aviso vermelho na tela. Os avisos de NPS são conferidos em qualquer tela do sistema.',
      },
      {
        tipo: 'dica',
        titulo: 'Os avisos ficam neste navegador',
        conteudo: 'A caixa de notificações fica guardada no navegador em que você trabalhou. Se você trocar de computador ou de navegador, não verá os avisos antigos lá.',
      },
    ],
  },

  {
    id: 'chat-pacientes',
    grupo: 'inicio',
    titulo: 'Chat de pacientes (WhatsApp)',
    icone: 'LuMessageCircle',
    caminho: null,
    quem: 'Perfis com o módulo Chat liberado',
    resumo: 'Converse com pacientes pelo WhatsApp oficial da empresa, respeitando a janela de 24 horas.',
    palavrasChave: ['chat', 'whatsapp', 'mensagem', 'janela 24h', 'reabrir', 'template', 'custo', 'não lidas'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como abrir o chat',
        itens: [
          'Clique no botão verde **Abrir chat de pacientes**, no canto inferior da tela. O número no botão mostra as mensagens não lidas.',
          'O chat abre em uma nova aba do navegador. Você continua usando o sistema na aba original.',
          'Na lista da esquerda, use **Buscar paciente ou número...** ou as abas **Todas**, **Não lidas** e **Lidas**.',
          'Clique na conversa para ver as mensagens. A tela se atualiza sozinha a cada poucos segundos.',
          'Digite no campo **Digite sua mensagem e aperte Enter...** e envie.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'A janela de 24 horas do WhatsApp',
        conteudo: 'Quando o paciente manda uma mensagem, abre uma janela de 24 horas. Nesse período, o topo da conversa mostra **Janela 24h Ativa** e você conversa à vontade, sem custo extra. Depois de 24 horas sem mensagem do paciente, aparece **Janela Expirada (Inativa)** e o campo de digitação some. Para voltar a falar, clique em **Reabrir com Termo** ou **Reabrir com NPS**. Cada reabertura envia uma mensagem padrão e gera cobrança no saldo da empresa. Use só quando precisar de um contato ativo.',
      },
      {
        tipo: 'lista',
        titulo: 'O que mais você vê na tela do chat',
        itens: [
          '**Horário Atual** e **Cota Mensal Meta (24h)**: quantas conversas já foram usadas no mês.',
          '**Status API Oficial**: qualidade do número e saldo.',
          '**Regras e Custos do Chat**: resumo das regras de uso. Leia antes de reabrir uma conversa.',
          'Mensagens enviadas pelo sistema aparecem como **Robô / Sistema**. As enviadas por pessoas mostram o nome do usuário.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Apagar conversa é definitivo',
        conteudo: 'O ícone de lixeira (**Apagar conversa**) apaga todo o histórico de mensagens daquele paciente. Não há como recuperar.',
      },
      {
        tipo: 'dica',
        titulo: 'Paciente com tratamento pausado',
        conteudo: 'O sistema não envia mensagens para paciente com o tratamento pausado. Retome o tratamento em **Necessidade de Navegação** antes de escrever.',
      },
    ],
  },

  // ===================================================================
  // JORNADA DO PACIENTE
  // ===================================================================
  {
    id: 'jornada-do-paciente',
    grupo: 'jornada',
    titulo: 'A jornada do paciente',
    icone: 'LuRoute',
    caminho: null,
    quem: 'Todos que atendem pacientes',
    resumo: 'Visão geral do caminho do paciente no sistema, da chegada pela sincronização até a pesquisa de satisfação.',
    palavrasChave: ['fluxo', 'passo a passo', 'visão geral', 'processo', 'etapas', 'como funciona'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Como o paciente chega',
        conteudo: 'Você não cadastra pacientes à mão. Eles vêm do sistema de compras quando alguém clica em **Sincronizar** na tela **Necessidade de Navegação**. Entram os pacientes cadastrados para Navegação Oncológica que têm compra de medicamento válida.',
      },
      {
        tipo: 'passos',
        titulo: 'Os passos da jornada',
        itens: [
          '**Sincronização**: o paciente e as compras de medicamento dele aparecem em **Necessidade de Navegação**, com o termo **Nao Enviado**.',
          '**Termo de consentimento**: você envia o link do termo por WhatsApp, e-mail ou link copiado. O paciente aceita ou recusa. Você também pode registrar um aceite feito por telefone.',
          '**Questionário**: com o termo aceito, o botão da linha vira **Avaliar**. Você aplica o questionário e o sistema calcula o score de tendência de adesão.',
          '**Configuração de uso contínuo**: você informa a posologia, as caixas, a data de início e a data do primeiro contato. A partir daí o paciente entra no **Telemonitoramento**.',
          '**Telemonitoramento periódico**: em cada contato você registra quantos comprimidos restam. O sistema calcula a adesão e sugere o próximo contato em 30, 15 ou 7 dias.',
          '**NPS**: ao final de cada contato registrado, o sistema oferece enviar a pesquisa de satisfação.',
          '**Linha do Tempo**: todo questionário, contato e descontinuação fica registrado no histórico do paciente.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Desvios comuns no caminho',
        itens: [
          'Paciente recusou o termo, mas vai usar o medicamento: use **Incluir paciente direto no Telemonitoramento** na tela de recusa.',
          'Paciente internado ou sem poder ser contatado: use **Pausar Tratamento** em Necessidade de Navegação.',
          'Paciente parou um medicamento por um tempo: use **⏸ Pausar** no Telemonitoramento.',
          'Paciente parou de vez: marque a descontinuação ao registrar o contato.',
          'Chegou compra nova ou outro medicamento: o sistema avisa ao abrir o contato.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'O questionário vence',
        conteudo: 'Cada questionário vale 6 meses. Cinco dias antes do vencimento, o paciente aparece em **Alertas** como **Avaliação** para você renovar.',
      },
    ],
  },

  // ===================================================================
  // ATENDIMENTO
  // ===================================================================
  {
    id: 'dashboard',
    grupo: 'atendimento',
    titulo: 'Dashboard',
    icone: 'LuLayoutDashboard',
    caminho: '/',
    quem: 'Perfis com o módulo Dashboard',
    resumo: 'Painel com os principais indicadores: NPS, pacientes sincronizados e monitorados, termos, adesão, RAM, falhas de contato e trocas de medicamento.',
    palavrasChave: ['indicadores', 'gráficos', 'relatório', 'mês', 'fechar mês', 'nps', 'adesão', 'excel', 'período'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Para que serve',
        conteudo: 'É a primeira tela depois do login, com o título **Visão Geral - Monitoramento Clínico**. Mostra os números do acompanhamento em um período. Usuários da CIC Farma veem todas as operadoras. Os demais veem só as operadoras ligadas ao seu usuário.',
      },
      {
        tipo: 'lista',
        titulo: 'Os gráficos',
        itens: [
          '**Índice de Satisfação dos Usuários - NPS**: notas de 0 a 6 contam como **Detratores**, 7 e 8 como **Neutros** e 9 e 10 como **Promotores**.',
          '**Total de Pacientes Sincronizados**: pacientes que chegaram do sistema de compras.',
          '**Pacientes Elegíveis**: situação dos termos (Aceito, Pendente, Recusado, Cancelado).',
          '**% Adesão (Score Questionário)**: tendência de adesão pelos questionários.',
          '**Monitorados**: pacientes elegíveis com pelo menos um contato bem-sucedido no período.',
          '**% Aderência (Uso de medicamento)**: adesão calculada nos contatos de telemonitoramento.',
          '**RAM - Reação adversa a medicamento**: reações registradas nos contatos.',
          '**Problemas de Contato (Motivos de Falha)**: contatos sem sucesso, por motivo.',
          '**Histórico de Troca de Medicamentos**: medicamento antigo, novo e data de cada troca.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Como filtrar e exportar',
        itens: [
          'Preencha **Data Início** e **Data Fim**. Sem datas, o painel mostra todo o histórico.',
          'Clique em **Filtrar**.',
          'Em **Visualizar Gráfico**, escolha um gráfico para vê-lo em tela cheia, ou deixe **Ver Todos**.',
          'Clique no ícone de download de cada gráfico (**Baixar relatório em Excel**) para baixar a lista de pacientes por trás do número.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Mês fechado não muda mais',
        conteudo: 'No dia 3 de cada mês, o sistema fecha automaticamente o mês anterior e guarda uma fotografia dos números. Quando você filtra exatamente do dia 1 ao último dia de um mês já fechado, o painel mostra essa fotografia, mesmo que dados novos tenham chegado depois. Assim um relatório já entregue à operadora não muda sozinho. Qualquer outro período é calculado na hora.',
      },
      {
        tipo: 'dica',
        titulo: 'Fechar o mês antes do dia 3',
        conteudo: 'Perfis com a permissão **Fechar Mês (Dashboard)** veem o botão **Fechar Mês Anterior (MM/AAAA)**. Use quando todos os dados do mês já chegaram e você quer congelar antes do dia 3. Depois de fechado, aparece a mensagem **Mês anterior (MM/AAAA) já foi fechado.**',
      },
    ],
  },

  {
    id: 'necessidade-navegacao',
    grupo: 'atendimento',
    titulo: 'Necessidade de Navegação',
    icone: 'LuCompass',
    caminho: '/necessidade-navegacao',
    quem: 'Perfis com o módulo Questionários e Avaliações',
    resumo: 'Porta de entrada dos pacientes: sincronize, filtre, envie o termo, aplique o questionário e pause ou retome o tratamento.',
    palavrasChave: ['sincronizar', 'pacientes novos', 'termo', 'avaliar', 'pausar tratamento', 'retomar', 'cancelar termo', 'segundo plano', 'filtros', 'contadores'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Para que serve',
        conteudo: 'A tela **Navegação de Pacientes** lista todos os pacientes vindos do sistema de compras. Aqui você decide o próximo passo de cada um: enviar o termo, aplicar o questionário ou pausar o tratamento. A lista vem ordenada pelo custo do medicamento, do maior para o menor, para você priorizar os casos de alto custo. Clique no título **Medicamento / Custo** para inverter a ordem.',
      },
      {
        tipo: 'passos',
        titulo: 'Como sincronizar pacientes novos',
        itens: [
          'Olhe o aviso no topo da tela. **Banco atualizado.** indica que não há nada novo. **X paciente(s) + Y evento(s) aguardando sincronização!** indica que há pacientes ou compras novas no sistema de compras.',
          'Clique em **Sincronizar** e aguarde **Sincronizando...** terminar.',
          'Se algum paciente não entrar, aparece uma faixa amarela **X paciente(s) não sincronizaram nesta rodada**. Clique nela para ver o nome e o motivo de cada um.',
          'Corrija o cadastro indicado no sistema de compras e clique em **Sincronizar** de novo.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Compra desmarcada como recebida no sistema de compras',
        conteudo: 'Se uma compra for desmarcada como **recebida** no sistema de compras (por exemplo, quando a programação é reaproveitada para outra data), a próxima sincronização tira essa compra das compras pendentes do telemonitoramento. Ela volta sozinha quando for marcada como recebida de novo. Se a compra já tinha sido usada num ciclo, o ciclo não muda: fica só um aviso na **Auditoria** para a equipe conferir.',
      },
      {
        tipo: 'lista',
        titulo: 'Os contadores do topo',
        itens: [
          'Cada círculo é um filtro. Clique para ver só aquele grupo. A tela abre em **Não Enviados**.',
          '**Não Enviados**: o termo ainda não foi enviado.',
          '**Pendentes**: o termo foi enviado e o paciente ainda não respondeu.',
          '**Em 2º Plano**: termos que você deixou aguardando resposta em segundo plano.',
          '**Aceitos** e **Recusados**: resposta do paciente.',
          '**Todos**: todos os pacientes, inclusive os de termo cancelado.',
          '**⏸ Pausados**: pacientes com o tratamento pausado, com motivo e data da pausa.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Filtros e ações da linha',
        itens: [
          'Filtre por **Paciente ou CPF**, **Nome do Cuidador** e **Telefone / Celular**. Usuários da CIC Farma também filtram por **Operadora**. Clique em **Limpar Filtros** para recomeçar.',
          'Botão principal: **Termo** (enviar o termo), **Aguardando** (termo em 2º plano), **Continuar** (avaliação parcial) ou **Avaliar** (termo aceito, abre o questionário).',
          'Ícone de pausa (**Pausar Tratamento**) e ícone de play (**Retomar Tratamento**).',
          'Ícone X (**Cancelar Termo**): invalida o link já enviado. Aparece quando o termo já foi enviado.',
          'Ícone de olho (**Ver Histórico**): abre o **Histórico de Avaliações**, com as respostas e a pontuação de cada data.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'O sistema confere o paciente antes de abrir',
        conteudo: 'Ao clicar no botão principal, o sistema busca no sistema de compras as atualizações daquele paciente. O botão mostra **Sincronizando...** por alguns segundos. Se a busca falhar, aparece um aviso e os dados podem estar desatualizados.',
      },
      {
        tipo: 'passos',
        titulo: 'Como pausar o tratamento de um paciente',
        itens: [
          'Clique no ícone de pausa na linha do paciente.',
          'Em **Motivo da Pausa ***, escolha o motivo. A lista vem de **Motivos de Pausa/Descontinuação**.',
          'Se quiser, escreva uma **Observação (opcional)**.',
          'Clique em **Confirmar Pausa**.',
          'Para retomar, abra o contador **⏸ Pausados** e clique em **Retomar**. Confirme a mensagem.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'O que muda com o tratamento pausado',
        conteudo: 'Enquanto o tratamento está pausado, o paciente sai da lista principal e das pendências do Telemonitoramento. O sistema também bloqueia o envio de termo, de NPS e de mensagens de chat para ele. Nada volta sozinho: alguém precisa clicar em **Retomar**.',
      },
    ],
  },

  {
    id: 'termo-de-consentimento',
    grupo: 'atendimento',
    titulo: 'Termo de consentimento',
    icone: 'LuFileSignature',
    caminho: '/necessidade-navegacao',
    quem: 'Perfis com o módulo Termos de Aceite',
    resumo: 'Envie o link do termo, acompanhe a resposta, registre um aceite por telefone e entenda o que o paciente vê.',
    palavrasChave: ['termo', 'aceite', 'link', 'whatsapp', 'e-mail', 'copiar link', 'cuidador', 'aceite manual', 'recusado', 'cancelar termo', '2º plano'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como enviar o termo',
        itens: [
          'Em **Necessidade de Navegação**, clique em **Termo** na linha do paciente. Abre a janela **Termos de Acompanhamento**.',
          'Em **Selecione o destinatário do link:**, escolha uma opção. Se o paciente tem cuidador, o envio para o cuidador já vem marcado.',
          'Para número digitado, informe um celular com DDD e o dígito 9. Para e-mail, confira o endereço: ele é salvo no cadastro do paciente.',
          'Clique no botão de envio. O nome muda conforme a opção: **Enviar Link via WhatsApp**, **Enviar Link via E-mail** ou **Gerar e Copiar Link**.',
          'Aguarde a tela **Aguardando resposta do paciente...**. Ela se atualiza sozinha quando o paciente responde.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'As formas de envio',
        itens: [
          '**Disparar via WhatsApp para o Cuidador**: só aparece quando o paciente tem cuidador cadastrado.',
          '**Disparar via WhatsApp para o Paciente**: usa o celular do cadastro. Se o paciente tem cuidador, o sistema pede confirmação.',
          '**Digitar um número de WhatsApp manualmente**: para um número que não está no cadastro.',
          '**Enviar link por E-mail**.',
          '**Gerar e copiar link (envio manual)**: o sistema não envia nada. O link vai para a área de transferência e você cola onde quiser.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Enquanto espera a resposta',
        itens: [
          '**Colocar em 2º Plano (Aguardar em Fundo)**: fecha a janela e o paciente vai para o contador **Em 2º Plano**. Quando ele aceitar, o aviso cai na caixa de **Notificações**.',
          '**Registrar Aceite Manual (Telefone / Conversa)**: use quando o paciente aceitou falando com você. Responda **SIM** ou **NÃO** em **O paciente aceitou o termo verbalmente?**. Essa pergunta também aparece sozinha depois de alguns segundos.',
          'Com o aceite, aparece **Termo aceito com sucesso!** e, em 3 segundos, o questionário abre.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Se o paciente recusar',
        conteudo: 'Aparece **O Termo não foi aceito**. Clique em **Tentar Outro Envio** se a recusa foi engano. Se o paciente não aceita o acompanhamento, mas vai usar o medicamento, clique em **Incluir paciente direto no Telemonitoramento**. Abre a **Configuração de Uso Contínuo**, com a pergunta **O paciente vai usar este medicamento?** para cada medicamento.',
      },
      {
        tipo: 'lista',
        titulo: 'O que o paciente vê ao abrir o link',
        itens: [
          'A página **Termo de Aceite para Navegação**, com o nome da operadora pedindo permissão para os contatos.',
          'A caixa **Li e aceito os termos e condições para aplicação do acompanhamento.** O texto **termos e condições** abre o documento completo. Sem marcar a caixa, o aceite não segue.',
          'Os botões **Sim, eu aceito** e **Não aceito**. Ao recusar, ele confirma em **Sim, não quero aceitar** ou volta em **Não, voltar**.',
          'Se já aceitou, vê a data do aceite. Se recusou, vê **Atendimento Suspenso** e a orientação de pedir um novo link ao atendente.',
          'Se o termo foi cancelado, vê **Link Indisponível**.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Cancelar o termo invalida o link',
        conteudo: 'O ícone X (**Cancelar Termo**) faz o link enviado parar de funcionar. Use quando o link foi para o número errado. Depois, envie um novo termo pelo botão **Termo**. Paciente com tratamento pausado não recebe termo.',
      },
    ],
  },

  {
    id: 'questionario-avaliacao',
    grupo: 'atendimento',
    titulo: 'Questionário (avaliação)',
    icone: 'LuClipboardList',
    caminho: '/necessidade-navegacao',
    quem: 'Perfis com o módulo Questionários e Avaliações',
    resumo: 'Aplique o questionário ao paciente, veja o score de tendência de adesão e consulte ou refaça avaliações anteriores.',
    palavrasChave: ['avaliação', 'questionário', 'score', 'pontuação', 'adesão', 'refazer', 'histórico', 'etapas'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como aplicar o questionário',
        itens: [
          'Em **Necessidade de Navegação**, clique em **Avaliar** na linha de um paciente com termo aceito. Abre a tela **Realizar Avaliação**.',
          'Leia o aviso **ATENÇÃO: NUNCA falar sobre o diagnóstico com o paciente.** e confira os **Dados do Paciente**.',
          'Em **Selecione o Questionário Pendente:**, escolha o questionário. Aparecem só os questionários ativos que o paciente ainda não respondeu.',
          'Responda todas as perguntas da etapa. Itens de orientação, com o ícone de informação, não precisam de resposta.',
          'Clique em **Próxima Etapa**. Para voltar, use **Voltar Etapa**.',
          'Na última etapa, clique em **Enviar Avaliação**.',
          'Veja a pontuação e a tendência de adesão. Clique em **Continuar**.',
          'Se o paciente ainda não tem acompanhamento de medicamento, preencha a **Configuração de Uso Contínuo**. Ao final, clique em **Voltar à Tabela**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Como ler a pontuação',
        itens: [
          'Durante o preenchimento, o quadro **Score Atual** mostra a soma dos pontos até aquele momento.',
          'Até 9 pontos: **ALTA adesão**. Baixo risco de abandono.',
          'De 10 a 12 pontos: **MÉDIA adesão**. Reforce as orientações.',
          '13 pontos ou mais: **BAIXA adesão**. Acompanhe de perto.',
          'Quanto maior o score, maior o risco. No Telemonitoramento, esses pacientes ficam no topo da página.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Histórico e refazer',
        conteudo: 'Quando o paciente já respondeu todos os questionários ativos, a tela mostra o **Histórico de Avaliações**, com **Avaliação**, **Data da Avaliação**, **Pontuação** e **Próxima Prevista**. A data prevista fica vermelha quando faltam 10 dias ou menos. Clique em **Refazer** na avaliação mais recente para aplicar o questionário de novo. As antigas aparecem como **Atualizada**.',
      },
      {
        tipo: 'atencao',
        titulo: 'Responda tudo antes de avançar',
        conteudo: 'O sistema não deixa avançar com pergunta em branco. Aparece **Por favor, responda todos os itens desta etapa antes de avançar.** Se clicar em **Sair**, as respostas daquela tela não são salvas.',
      },
      {
        tipo: 'dica',
        titulo: 'Paciente que já está no Telemonitoramento',
        conteudo: 'Quando você refaz o questionário de um paciente que já tem acompanhamento, a pontuação nova passa a valer no Telemonitoramento e nos Alertas. Você não precisa configurar o medicamento de novo.',
      },
    ],
  },

  {
    id: 'uso-continuo',
    grupo: 'atendimento',
    titulo: 'Configuração de uso contínuo',
    icone: 'LuPill',
    caminho: null,
    quem: 'Quem aplica o questionário ou inclui pacientes no Telemonitoramento',
    resumo: 'Informe posologia, caixas, padrão de uso e datas para o paciente entrar no Telemonitoramento.',
    palavrasChave: ['posologia', 'cíclica', 'diária', 'a cada x dias', 'personalizada', 'caixas', 'data de entrega', 'primeiro telemonitoramento', 'comprimidos ao dia'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Quando aparece',
        conteudo: 'A **Configuração de Uso Contínuo** aparece depois do primeiro questionário do paciente e quando você inclui direto no Telemonitoramento um paciente que recusou o termo. É ela que cria o acompanhamento e agenda o primeiro contato.',
      },
      {
        tipo: 'passos',
        titulo: 'Como preencher',
        itens: [
          'Se houver mais de uma compra do medicamento aguardando, escolha a que o paciente está usando agora. Se escolher uma compra mais recente, marque a confirmação de que as anteriores já foram usadas. É obrigatório.',
          'Em **Comprimidos ao dia?**, informe quantos comprimidos o paciente toma em cada dia de dose. Se o padrão não for diário, o campo passa a se chamar **Comprimidos por dose (em cada dia que toma)?** — mesmo significado.',
          'Confira **Qtd. Caixas:**.',
          'Em **Padrão de posologia**, escolha o tipo e confira o calendário **Prévia — próximos 35 dias**. Dias verdes são dias de tomar.',
          'Confira a **Data de Início/Entrega do Medicamento**.',
          'Confira a **Data do primeiro telemonitoramento**. O sistema sugere 5 dias depois do início. Se cair em sábado ou domingo, passa para segunda.',
          'Clique em **Confirmar Monitoramentos**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Tipos de posologia',
        itens: [
          '**Diária**: toma todo dia.',
          '**Cíclica (toma/pausa)**: preencha **Toma por X dia(s)** e **Pausa por Y dia(s)**. Exemplo: toma 21, pausa 7.',
          '**A cada X dias**: preencha **Toma 1 vez a cada X dia(s)**. Para uma vez por mês, use 30.',
          '**Personalizada**: clique nos dias do calendário em que o paciente toma. Não se repete sozinha, vale só para as datas marcadas. Use também para dose única.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Confira o calendário antes de salvar',
        conteudo: 'O calendário de prévia é exatamente o padrão que vai valer para contar os comprimidos. Em posologias que não são diárias, o sistema pede uma confirmação extra. Se o sistema não souber quantos comprimidos vêm na caixa, aparece **Qtd. total de comprimidos por caixa:** e o campo passa a ser obrigatório.',
      },
      {
        tipo: 'texto',
        titulo: 'Mais de um medicamento',
        conteudo: 'Se o paciente usa vários medicamentos juntos, a tela mostra **Este paciente utiliza N medicamentos em conjunto** e um medicamento por vez (**Medicamento 1 de N**). Preencha e clique em **Confirmar e Avançar →**. No último, há uma única **Data do Primeiro Telemonitoramento (Conjunto)**, calculada 5 dias depois da entrega mais tardia. Você pode mudar essa data.',
      },
      {
        tipo: 'dica',
        titulo: 'Errou a posologia ou a data?',
        conteudo: 'Enquanto o paciente está no primeiro ciclo daquele medicamento, corrija na tela **Recálculo**. Depois do primeiro contato, a correção é feita ao registrar o contato.',
      },
    ],
  },

  {
    id: 'telemonitoramento',
    grupo: 'atendimento',
    titulo: 'Telemonitoramento: a lista',
    icone: 'LuActivity',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'Lista de pacientes em acompanhamento de medicamento, com score, adesão, próximo contato e o histórico de cada ciclo.',
    palavrasChave: ['lista', 'fila', 'contatos agendados', 'score', 'adesão', 'média', 'busca', 'encerrado', 'pausados', 'entenda as pontuações', 'estoque estimado'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Para que serve',
        conteudo: 'A tela **Telemonitoramentos agendados** mostra todos os pacientes com contato de acompanhamento pendente. Cada linha é um paciente. Clique na linha para abrir os detalhes de cada medicamento e registrar contatos.',
      },
      {
        tipo: 'lista',
        titulo: 'As colunas',
        itens: [
          '**Paciente e Adesão**: número e nome do paciente, **Score** do questionário, **Média** de adesão nos contatos e a classificação de tendência de adesão. Também mostra **⚠ Encerrou X em data** quando um dos medicamentos foi encerrado.',
          '**Cuidador** e **Operadora**.',
          '**Medicamento Atual**: com a estimativa **~N un. estimadas** de comprimidos que o paciente deve ter hoje. Em uso conjunto, mostra **Uso Conjunto (N medicamentos)**.',
          '**Próximo Contato**: data e prazo (**Hoje**, **Amanhã**, **Em X dias** ou **Atrasado há X dias**).',
          '**Status Geral**: quantos contatos estão concluídos e pendentes.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Como ler o score e a adesão',
        itens: [
          'Clique em **Entenda as Pontuações** para ver a régua. O questionário vale no máximo 17 pontos.',
          '0 a 9 pontos: alta tendência a adesão. 10 a 12: tendência moderada. 13 ou mais: risco de baixa adesão.',
          'A **Média** vem dos contatos já feitos: alta adesão conta 100%, média 50% e baixa 0%. Verde a partir de 80%, laranja a partir de 50% e vermelho abaixo disso.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Detalhes de cada paciente',
        itens: [
          'Colunas: **Data Adm.**, **Data Prog. Contato**, **Medicamento**, **Fim da Caixa**, **Adesão Tele.**, **Status Contato**, **Observações** e **Ações**.',
          'Um **!** ao lado da data de administração indica que ela foi corrigida. Passe o mouse para ver a data antiga.',
          'A etiqueta **⚙ posologia alterada** mostra a nova dose e a data da mudança.',
          'Ações do contato pendente: **Registrar Contato**, **⏸ Pausar** e, quando a estimativa chega a zero, **Criar Evento Reembolso**.',
          'Contato já feito: **Já realizado** e o lápis (**Editar este contato concluído**). Se há NPS aguardando, aparece **Acompanhar NPS**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Busca e filtros',
        itens: [
          '**Buscar paciente por nome...**: procura pelo nome e sobrenome.',
          '**Mostrar apenas pacientes com acompanhamento encerrado (todos os medicamentos)**: mostra quem teve todos os medicamentos descontinuados. Se chegou compra nova para ele, aparece **Iniciar Tratamento**. Senão, use **Verificar novamente** para buscar compras no sistema de compras.',
          '**⏸ Ver pausados temporariamente (N)**: mostra os medicamentos pausados. Veja o tópico de pausa.',
          'Clique nos títulos **Paciente e Adesão** e **Próximo Contato** para mudar a ordem.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Como a ordem funciona',
        conteudo: 'Cada página mostra 20 pacientes. As páginas são montadas pela data do próximo contato, do mais antigo para o mais distante. Dentro da página, a lista vem ordenada pelo score, do maior risco para o menor. Para ver os próximos pacientes por data, use **Próxima** no fim da lista.',
      },
      {
        tipo: 'dica',
        titulo: 'Paciente sumiu da lista?',
        conteudo: 'Pacientes com o tratamento pausado em **Necessidade de Navegação** não aparecem aqui. Medicamentos pausados ficam em **⏸ Ver pausados temporariamente**. Pacientes com todos os medicamentos descontinuados ficam no filtro de acompanhamento encerrado.',
      },
    ],
  },

  {
    id: 'telemonitoramento-contato',
    grupo: 'atendimento',
    titulo: 'Registrar um contato',
    icone: 'LuPhone',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'Passo a passo do contato: tentativa sem sucesso, comprimidos restantes, adesão calculada, reação adversa, mudança de dose e próximo contato.',
    palavrasChave: ['registrar contato', 'comprimidos restantes', 'adesão', 'reação adversa', 'mudança de dose', 'posologia', 'contato sem sucesso', 'falha', 'data de administração', 'calculadora', 'próximo contato', 'editar contato', 'em atendimento'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como registrar um contato',
        itens: [
          'Clique na linha do paciente e depois em **Registrar Contato**. O sistema busca atualizações do paciente (**Sincronizando...**).',
          'Em **O contato foi efetivado com sucesso?**, marque **Sim** ou **Não (Paciente não atendeu/ausente)**. Clique em **Continuar**.',
          'Se a data de início do uso não estiver registrada, informe **Data de Início da Administração (Quando começou a tomar?)** e clique em **Confirmar Data e Avançar**.',
          'Confira o quadro do centro: medicamento, quantidade inicial, padrão de posologia, **Data prevista para o fim do ciclo** e **Estoque Projetado para Hoje**.',
          'Em **Quantos comprimidos restam com o paciente no total?**, digite o que o paciente informou. A adesão é calculada na hora.',
          'Em **O paciente relatou alguma reação adversa?**, marque **Sim** ou **Não**. Com **Sim**, escolha todas as reações na lista.',
          'Confira a **Data do próximo contato de acordo com a adesão ao medicamento**. Mude se precisar. Ela não pode ficar no passado.',
          'Se quiser, escreva em **Observação (Opcional)**.',
          'Clique em **Salvar Registro**. Em seguida, o sistema oferece enviar o NPS.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Como a adesão e o próximo contato são calculados',
        itens: [
          'O sistema compara o que o paciente tem com o **Estoque Projetado para Hoje** e converte a diferença em dias de dose.',
          'Diferença de até 2 dias: **Alta adesão ao uso do medicamento**. Próximo contato em 30 dias.',
          'Diferença de 3 a 6 dias: **Média adesão ao uso do medicamento**. Próximo contato em 15 dias.',
          'Diferença maior que 6 dias: **Baixa adesão ao uso do medicamento**. Próximo contato em 7 dias.',
          'Se a data cair em sábado ou domingo, passa para segunda. O campo de adesão fica travado, porque é calculado.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Contato sem sucesso',
        itens: [
          'Marque **Não (Paciente não atendeu/ausente)**.',
          'Em **Qual o motivo da falha no contato?**, escolha o motivo. A lista vem de **Falhas de Contato**.',
          'Clique em **Registrar Falha de Contato**. O contato é reagendado para o próximo dia útil.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Situações dentro do contato',
        itens: [
          '**Houve alteração da posologia (dosagem) no meio deste ciclo?**: informe a **Nova Posologia (comprimidos/dia)**, **A partir de que dia começou a tomar a nova dose?** e o novo padrão. O estoque é recalculado e aparece **Matemática Reajustada**.',
          'Data de início errada: clique em **Corrigir** (ou **Informar**) ao lado da data de administração.',
          '**Me ajude a calcular a data de administração** abre a **Calculadora de datas**. Escreva algo como "61 comprimidos, caixa de 90, toma 1 por dia, quando começou?", clique em **Enviar** e depois em **Usar essa data**. Ajuste **Data em que o tele foi realizado** se o contato foi feito em outro dia.',
          'Nas laterais você vê o **Resumo do Último Contato**, o **Histórico de Compras** (cada compra recebida, com quantidade, datas e se já foi aplicada) e as **Aberturas de Caixas** (cada caixa iniciada). No celular, essas informações aparecem abaixo do formulário.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Paciente em atendimento por outro usuário',
        conteudo: 'Só uma pessoa por vez registra contato de um paciente. Se outra pessoa já abriu, aparece **⏳ Paciente em Atendimento** com o nome dela. Clique em **Fechar** e tente em alguns minutos. A reserva some quando a outra pessoa fecha a janela. Se o navegador dela fechou de repente, a reserva expira sozinha em até 20 minutos.',
      },
      {
        tipo: 'dica',
        titulo: 'Corrigir um contato já salvo',
        conteudo: 'Na linha do contato concluído, clique no lápis. Na janela **✏️ Editar Contato Concluído**, você muda só as reações adversas e a observação. Clique em **Salvar Alterações**. Comprimidos, adesão e datas não podem ser editados depois de salvos.',
      },
    ],
  },

  {
    id: 'nova-compra',
    grupo: 'atendimento',
    titulo: 'Nova compra e troca de medicamento',
    icone: 'LuPill',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'O que fazer quando o sistema detecta uma compra nova, uma alteração na compra atual ou um medicamento diferente ao abrir o contato.',
    palavrasChave: ['nova compra', 'troca', 'substituir', 'novo medicamento', 'nova caixa', 'novo ciclo', 'alteração no fornecimento', 'iniciar tratamento', 'compra pendente', 'evento antigo'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'O que o sistema verifica',
        conteudo: 'Toda vez que você abre **Registrar Contato**, o sistema consulta o sistema de compras (**Consultando atualizações externas...**). Ele procura mudanças na compra atual e compras novas do paciente.',
      },
      {
        tipo: 'texto',
        titulo: 'Alteração na compra atual',
        conteudo: 'Se o medicamento ou a quantidade de caixas da compra atual mudou no sistema de compras, aparece **⚠️ Alteração no Fornecimento Detectada**, com a informação anterior e a atualizada. Clique em **Confirmar Troca** para aplicar ou em **Ignorar** para manter como está.',
      },
      {
        tipo: 'passos',
        titulo: 'Quando chega uma compra nova',
        itens: [
          'Leia o quadro da compra: **ID do Evento (sistema externo)**, **Data Prevista Para Entrega**, **Previsão de Uso do Medicamento** e o **Detalhamento do Estoque Projetado**.',
          'Se o paciente já começou a caixa nova, marque **Aplicar dados desta nova compra automaticamente no fechamento deste contato**.',
          'Confira a data de início da nova caixa, a posologia e o padrão de posologia do novo ciclo.',
          'Se houver várias compras, escolha a que o paciente usa agora. Marque **Confirmo que o paciente já utilizou essa(s) compra(s) anterior(es)**.',
          'Preencha o restante do contato e clique em **Salvar Registro**. Um novo ciclo começa e a contagem de comprimidos recomeça da data de início informada.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Avisos que podem aparecer',
        itens: [
          '**Risco de Pausa no Tratamento**: com as datas informadas, o paciente fica alguns dias sem medicação entre uma caixa e outra. Confira a data.',
          '**Novo Ciclo Iniciado**: a caixa nova começou antes de a anterior acabar. As sobras são desconsideradas, a não ser que o medicamento esteja com **Acumular sobras entre as caixas** ativado (veja o tópico **Acumular sobras entre as caixas**).',
          '**Este é um evento antigo**: a previsão de uso tem mais de 90 dias. Marque a confirmação só se a caixa ainda estiver em uso.',
          '**Há outra compra pendente para este paciente**: existe mais de uma compra esperando.',
          '**Apresentação diferente da atual**: mesmo princípio ativo com outro cadastro, por exemplo outra dose ou marca. Confira a posologia.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Não vai aplicar a compra agora? Informe o motivo',
        conteudo: 'Se você não marcar a aplicação da compra, escolha o **Motivo para não aplicar esta compra agora**: paciente ainda não recebeu, ainda está na caixa anterior, dados divergentes, compra não corresponde a este tratamento ou **Outro (descrever)**. Com **Outro**, a descrição é obrigatória. A compra continua pendente e volta no próximo contato. As compras marcadas como já utilizadas não geram ciclo e aparecem no Faturamento como **Sem acompanhamento**.',
      },
      {
        tipo: 'lista',
        titulo: 'Medicamento diferente na compra',
        itens: [
          'O quadro mostra **Atenção: Novo Medicamento Detectado na Compra!**.',
          '**Usar em conjunto (manter os dois medicamentos)**: o novo medicamento passa a ser acompanhado em paralelo, cada um com seu ciclo. Depois de salvar, você completa o registro do segundo medicamento.',
          '**Substituir o medicamento atual**: o novo medicamento assume o lugar do anterior. A troca aparece no Dashboard, em **Histórico de Troca de Medicamentos**.',
          'Se o paciente já tem o número máximo de medicamentos simultâneos, a compra é tratada como substituição.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Iniciar um tratamento novo',
        conteudo: 'Se, depois de salvar o contato, o paciente tiver compra de um medicamento ainda sem acompanhamento, abre **Iniciar Novo Tratamento**. Marque **Iniciar acompanhamento agora**, preencha **Comprimidos ao dia**, **Qtd. Caixas**, o padrão de posologia, **Data de Entrega** e **Data do Primeiro Contato**, e clique em **Confirmar e Iniciar**. Você pode iniciar no máximo 2 medicamentos de uma vez. O mesmo botão **Iniciar Tratamento** aparece na lista para pacientes com acompanhamento encerrado.',
      },
    ],
  },

  {
    id: 'acumular-sobras',
    grupo: 'atendimento',
    titulo: 'Acumular sobras entre as caixas',
    icone: 'LuLayers',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'Para quem toma em ciclos e a caixa não fecha um ciclo inteiro: a sobra da caixa anterior é somada à caixa nova, e a adesão volta a ser calculada certo.',
    palavrasChave: ['acumular', 'sobra', 'sobras', 'somar', 'cíclico', 'ciclo', 'caixa não fecha', 'baixa adesão', 'estoque', 'reabastecer'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Quando usar',
        conteudo: 'Pela regra padrão, a caixa nova **substitui** o estoque: a sobra da caixa anterior é desconsiderada. Em esquemas em ciclos isso dá errado. Exemplo: 6 comprimidos por 14 dias e pausa de 7 dias gastam 84 comprimidos por ciclo, mas a caixa tem 120. Sobram 36 a cada caixa, o paciente compra outra para completar e sempre informa mais do que o sistema projeta. Resultado: **baixa adesão** mesmo tomando tudo certo. Com **Acumular sobras entre as caixas** ativado, a sobra é somada à caixa nova.',
      },
      {
        tipo: 'passos',
        titulo: 'Como ativar',
        itens: [
          'Abra **Registrar Contato** do paciente.',
          'No cartão **Acumular sobras entre as caixas**, marque a caixa de seleção.',
          'Escreva o motivo (opcional, fica no histórico), por exemplo: **caixa de 120 e o ciclo usa 84 comprimidos**.',
          'Clique em **Confirmar e ativar**. O cartão passa a mostrar **Ativado**. A opção é salva na hora, mesmo que você ainda não tenha salvo o contato. Enquanto não clicar, a etiqueta mostra **Falta confirmar**, a opção ainda não vale (a compra não soma a sobra) e o sistema não deixa salvar o contato.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Na compra nova, confirme a sobra',
        itens: [
          'Marque **Aplicar dados desta nova compra** como de costume e preencha **Quantos comprimidos restam com o paciente no total?** (o total com o paciente, incluindo a caixa nova se ele já recebeu).',
          'No **Detalhamento do Estoque Projetado** aparece **+ Sobra da caixa anterior** com um número sugerido: quantos comprimidos da caixa anterior o sistema projeta que o paciente terá no dia em que a caixa nova começa (mesma conta do estoque projetado). Ele aparece mesmo antes de você preencher o total do contato.',
          'Confirme com o paciente quantos comprimidos da caixa anterior ele terá no início da caixa nova e corrija o número se precisar.',
          'O **Total do Novo Ciclo** passa a ser caixa nova + sobra. O estoque projetado, a adesão e a data prevista para o fim do ciclo já usam esse total.',
          'Abaixo do **Estoque Projetado para Hoje** aparece o resumo **Caixa anterior (sobra) + Caixa nova = Total esperado com o paciente** (ex.: 25 + 90 = 115). Confira com o paciente se ele tem esse total, somando os comprimidos soltos e a caixa nova.',
          'Clique em **Salvar Registro**. No ciclo seguinte aparece: **Quantidade total inicial: 120 comprimidos + 36 de sobra da caixa anterior = 156 comprimidos**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Como funciona',
        itens: [
          'Vale para **este medicamento deste paciente**. Outro paciente com o mesmo medicamento não é afetado. Paciente com 3 medicamentos em ciclos: ative em cada um.',
          'Ative **uma vez só**. A opção segue para os próximos ciclos até alguém desativar.',
          'Para desativar, desmarque a caixa e clique em **Confirmar e desativar**. A partir daí a caixa nova volta a substituir o estoque.',
          'Em **Ver histórico desta opção** aparecem todas as vezes que alguém ativou ou desativou: quem, quando e o motivo. Tudo também vai para a **Auditoria**.',
          'Se a compra trocar o medicamento por outro (outro princípio ativo), a opção não passa para o medicamento novo.',
          'No **Faturamento** nada muda: a cobrança continua sendo por caixa comprada.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Só para sobra do esquema, não para esquecimento',
        conteudo: 'Se o paciente sobra comprimidos porque **esquece de tomar**, não ative. Somar essa sobra esconderia a falta de adesão. Ative apenas quando a sobra vem do esquema de tomada (a caixa não fecha um ciclo inteiro).',
      },
    ],
  },

  {
    id: 'telemonitoramento-pausa',
    grupo: 'atendimento',
    titulo: 'Pausar, retomar e descontinuar medicamento',
    icone: 'LuCirclePause',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'Pause um medicamento por um período, destrave ou estenda a pausa, e encerre o acompanhamento quando o paciente para de vez.',
    palavrasChave: ['pausar', 'pausa', 'destravar', 'estender', 'retomada', 'pausados', 'descontinuar', 'encerrar', 'internação', 'parou de tomar'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Pausar medicamento ou pausar tratamento?',
        conteudo: 'A pausa do Telemonitoramento vale para um medicamento, com data prevista de retomada. Os dias parados não contam no estoque. Para pausar o paciente inteiro, sem prazo, use **Pausar Tratamento** em **Necessidade de Navegação**.',
      },
      {
        tipo: 'passos',
        titulo: 'Como pausar um medicamento',
        itens: [
          'Na linha do contato pendente, clique em **⏸ Pausar**. Abre **Pausar Temporariamente**.',
          'Escolha o **Motivo da pausa ***.',
          'Em **Parou de tomar em (primeiro dia sem o medicamento) ***, informe a data. O sistema mostra quantos comprimidos o paciente deve ter.',
          'Confirme com o paciente. Se ele tiver outra quantidade, marque **Não** e preencha **Quantos comprimidos ele tem na caixa? ***.',
          'Informe **Retomar em (data prevista) ***.',
          'Clique em **Confirmar Pausa**.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Pausar durante o contato',
        conteudo: 'Dentro do **Registrar Contato**, marque **Pausar temporariamente este medicamento (não descontinuar)** e clique em **Confirmar Pausa**. Se uma compra nova estiver marcada para aplicar, o botão vira **Salvar e Pausar o Novo Ciclo**: o contato é salvo, o novo ciclo é criado e já fica pausado. Se a compra não for aplicada, ela continua pendente e volta quando a pausa for destravada.',
      },
      {
        tipo: 'passos',
        titulo: 'Como retomar ou estender',
        itens: [
          'Marque **⏸ Ver pausados temporariamente (N)**. Veja **Paciente**, **Medicamento**, **Motivo** e **Retomada prevista**.',
          'Paciente voltou a tomar: clique em **Destravar Pausa**. Em **Quando ele realmente voltou a tomar? ***, mantenha a data de hoje ou informe a data real. Clique em **Destravar e Registrar Contato**. O contato abre em seguida.',
          'Paciente ainda não pode voltar: clique em **Estender**, informe a **Nova data prevista de retomada *** e clique em **Estender Prazo**. O medicamento continua pausado.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Aviso de retomada',
        conteudo: 'Dois dias antes da retomada prevista, a pausa entra em **Alertas** e aparece um aviso na tela. Pausas vencidas aparecem como **vencida** na lista. Nada é retomado sozinho: alguém precisa destravar ou estender.',
      },
      {
        tipo: 'passos',
        titulo: 'Como descontinuar um medicamento',
        itens: [
          'Abra **Registrar Contato** e marque **Paciente descontinuou este medicamento (encerrar acompanhamento)**.',
          'Escolha o **Motivo do encerramento ***. A lista é a mesma da pausa.',
          'Informe a data em que parou e confirme a quantidade de comprimidos que sobrou.',
          'Preencha **Quantos comprimidos restam com o paciente no total?** e clique em **Salvar Registro**.',
          'O ciclo fica como **DESCONTINUADO** e nenhum contato novo é agendado para esse medicamento.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Paciente com outro medicamento',
        conteudo: 'Se o paciente encerrou um medicamento e continua com outro, ele segue na lista normal, com o aviso **⚠ Encerrou X em data**. Não é possível descontinuar e aplicar uma compra nova no mesmo contato.',
      },
    ],
  },

  {
    id: 'uso-em-conjunto',
    grupo: 'atendimento',
    titulo: 'Uso em conjunto (2 ou mais medicamentos)',
    icone: 'LuUsers',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'Como registrar um único contato para um paciente que usa vários medicamentos ao mesmo tempo.',
    palavrasChave: ['uso conjunto', 'dois medicamentos', 'vários medicamentos', 'divergência', 'divergente', 'mesma data'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Como reconhecer',
        conteudo: 'Na lista, a coluna **Medicamento Atual** mostra **Uso Conjunto (N medicamentos)**. Nos detalhes, os medicamentos aparecem juntos em uma linha **Uso Conjunto**. Clique nela e em **Ver detalhes** para ver cada um. Todos têm a mesma data de próximo contato.',
      },
      {
        tipo: 'passos',
        titulo: 'Como registrar o contato',
        itens: [
          'Clique em **Registrar Contato (N medicamentos)**.',
          'Responda se o contato foi efetivado. Se não foi, escolha o motivo: todos os medicamentos são reagendados para o próximo dia útil.',
          'Preencha o primeiro medicamento: comprimidos restantes, reação adversa, mudança de dose, pausa ou descontinuação.',
          'Clique em **Avançar para o próximo medicamento**. No último, clique em **Continuar**.',
          'Se as adesões forem iguais, o contato é salvo e o próximo é agendado pela adesão.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Quando as adesões são diferentes',
        conteudo: 'Aparece **Divergência de Adesão Identificada**, com o nível de cada medicamento e uma data sugerida pela média. Em **Como deseja agendar o próximo contato?**, escolha **Usar a data sugerida (média entre os medicamentos)**, **Agendar semanalmente (7 dias)** ou **Agendar mensalmente (30 dias)**. Clique em **Confirmar e Salvar**. Na lista, a coluna de adesão mostra **Divergente**.',
      },
      {
        tipo: 'atencao',
        titulo: 'Não registre um medicamento de cada vez',
        conteudo: 'Dentro do uso conjunto, os medicamentos que não são o principal aparecem com **Registrado junto com o outro medicamento**. O registro é sempre feito pelo botão da linha **Uso Conjunto**, para manter as datas alinhadas.',
      },
      {
        tipo: 'dica',
        titulo: 'Configuração inicial de vários medicamentos',
        conteudo: 'Quando o paciente começa com vários medicamentos, a Configuração de Uso Contínuo mostra um por vez e agenda um único primeiro contato. Veja o tópico **Configuração de uso contínuo**.',
      },
    ],
  },

  {
    id: 'reembolso',
    grupo: 'atendimento',
    titulo: 'Evento de reembolso',
    icone: 'LuDollarSign',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'Registre a caixa que o paciente comprou por conta própria e foi reembolsada pela operadora, para continuar o acompanhamento.',
    palavrasChave: ['reembolso', 'comprou por conta', 'reembolsado', 'estoque zerado', 'sem compra'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Quando usar',
        conteudo: 'Use quando o medicamento do paciente acabou, não chegou compra nova pelo sistema de compras e o paciente comprou por conta própria, com reembolso da operadora. O botão só aparece quando a estimativa de comprimidos chega a zero.',
      },
      {
        tipo: 'passos',
        titulo: 'Como criar o evento',
        itens: [
          'Nos detalhes do paciente, clique em **Criar Evento Reembolso**. Ou, dentro do **Registrar Contato**, clique em **Paciente comprou por conta e foi reembolsado pela operadora? Criar Evento de Reembolso**.',
          'Em **Quantidade de caixas reembolsadas**, informe só as caixas que a operadora reembolsou.',
          'Informe a **Data de início deste medicamento**.',
          'Confira a **Posologia (comprimidos/dia)**. Mude se a dose mudou.',
          'Se o sistema pedir, informe a quantidade de comprimidos por caixa.',
          'Clique em **Criar e Continuar Contato**. Em seguida, registre o contato normalmente.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Só as caixas reembolsadas',
        conteudo: 'Não informe o total de caixas que o paciente tem em casa. O ciclo de reembolso substitui o contato pendente anterior, que fica cancelado. A contagem de comprimidos recomeça na data de início informada.',
      },
    ],
  },

  {
    id: 'nps',
    grupo: 'atendimento',
    titulo: 'Pesquisa de satisfação (NPS)',
    icone: 'LuStar',
    caminho: '/telemonitoramento',
    quem: 'Perfis com o módulo Telemonitoramento',
    resumo: 'Envie a pesquisa de 0 a 10 ao final do contato, acompanhe a resposta ou registre a nota falada pelo paciente.',
    palavrasChave: ['nps', 'satisfação', 'nota', 'pesquisa', 'nota manual', 'acompanhar nps', 'detratores', 'promotores'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como enviar o NPS',
        itens: [
          'Depois de clicar em **Salvar Registro** em um contato, abre **Avaliação de Atendimento (NPS)**.',
          'Escolha o destinatário, como no termo: cuidador, paciente, número digitado, e-mail ou **Gerar e copiar link (envio manual)**.',
          'Clique em **Enviar Link via WhatsApp**, **Enviar Link via E-mail** ou **Gerar e Copiar Link**. Para não enviar, clique em **Agora Não**.',
          'Aguarde em **Aguardando Resposta...**. A nota aparece sozinha quando o paciente responde.',
          'Ao receber a nota, aparece **Pesquisa Concluída!**. Clique em **Finalizar**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Enquanto espera',
        itens: [
          '**Colocar em 2º Plano (Aguardar em Fundo)**: você segue trabalhando. Quando o paciente responder, o aviso cai na caixa de **Notificações**. Para voltar a acompanhar, clique em **Acompanhar NPS** na linha do contato.',
          '**O paciente prefere falar a nota? Insira manualmente**: pergunte a nota por telefone, digite de 0 a 10 e clique em **Salvar Nota**.',
          '**Voltar a escutar o sistema**: volta a esperar a resposta pelo link.',
          '**Cancelar e Fechar**: fecha sem esperar.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'O que o paciente vê',
        conteudo: 'O link abre a página **Pesquisa de Satisfação**, com a pergunta **Em uma escala de 0 a 10, como você avalia o nosso atendimento hoje?** e botões de 0 a 10. Depois de escolher, ele vê **Avaliação Registrada!**. Cada contato aceita uma nota só: se ele abrir o link de novo, vê **Obrigado!** e o aviso de que já avaliou.',
      },
      {
        tipo: 'atencao',
        titulo: 'Paciente pausado não recebe NPS',
        conteudo: 'O sistema bloqueia o envio para paciente com o tratamento pausado. A qualidade do número de WhatsApp aparece em **Status NPS (WhatsApp)**, no rodapé do menu.',
      },
      {
        tipo: 'dica',
        titulo: 'Onde ver os resultados',
        conteudo: 'No Dashboard, o gráfico **Índice de Satisfação dos Usuários - NPS** separa as notas em Detratores (0 a 6), Neutros (7 e 8) e Promotores (9 e 10).',
      },
    ],
  },

  {
    id: 'linha-do-tempo',
    grupo: 'atendimento',
    titulo: 'Linha do Tempo',
    icone: 'LuHistory',
    caminho: '/linha-do-tempo',
    quem: 'Perfis com o módulo Linha do Tempo',
    resumo: 'Histórico em ordem de data de cada paciente: questionários, contatos realizados, próximo contato e descontinuações.',
    palavrasChave: ['histórico', 'timeline', 'eventos', 'excel', 'paciente', 'cronologia'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como consultar',
        itens: [
          'Abra **Linha do Tempo** no menu. Você vê a tela **Linha do Tempo dos Pacientes**.',
          'Digite em **Busque por Nome, CPF ou Operadora e aperte Enter...** e aperte Enter.',
          'Clique na linha do paciente para abrir a linha do tempo dele.',
          'Clique no ícone de download (**Baixar linha do tempo em Excel**) para salvar o histórico.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'O que aparece',
        itens: [
          '**Questionário**: nome do questionário e o score calculado.',
          '**Monitoramento Realizado**: medicamento e posologia de cada contato.',
          '**Próximo Contato Agendado**: o contato que ainda vai acontecer.',
          '**Medicamento Descontinuado**: medicamento e motivo do encerramento.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Procurando outra informação?',
        conteudo: 'A Linha do Tempo não mostra termo, NPS nem pausas. Para o termo, use **Termos Assinados**. Para saber quem fez cada ação, use **Auditoria**.',
      },
    ],
  },

  {
    id: 'recalculo',
    grupo: 'atendimento',
    titulo: 'Recálculo',
    icone: 'LuCalculator',
    caminho: '/recalculo',
    quem: 'Perfis com o módulo Recálculo (Atendimento)',
    resumo: 'Corrija a posologia ou a data de início cadastradas erradas, enquanto o paciente está no primeiro ciclo do medicamento.',
    palavrasChave: ['recálculo', 'corrigir posologia', 'data de início', 'primeiro ciclo', 'erro de cadastro'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Para que serve',
        conteudo: 'A tela **Recálculo de Posologia / Data de Início** corrige erros feitos na Configuração de Uso Contínuo, sem precisar registrar um contato.',
      },
      {
        tipo: 'passos',
        titulo: 'Como recalcular',
        itens: [
          'Busque o paciente em **Buscar paciente...**.',
          'Confira **Posologia Atual** e **Data de Início Atual**.',
          'Clique em **Recalcular**. Abre **Recalcular Ciclo**.',
          'Corrija **Posologia (comprimidos/dia)**, **Data de Início** e o padrão de posologia. Confira o calendário de prévia.',
          'Clique em **Aplicar Recálculo** e confirme. O fim da caixa e o próximo contato são recalculados.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Só no primeiro ciclo',
        conteudo: 'Só aparecem pacientes com o primeiro ciclo daquele medicamento ainda pendente. Depois do primeiro contato registrado, o medicamento sai desta tela. A partir daí, corrija a dose em **Registrar Contato**, na opção **Houve alteração da posologia (dosagem) no meio deste ciclo?**, ou a data no botão **Corrigir**.',
      },
      {
        tipo: 'dica',
        titulo: 'Não encontrou o paciente?',
        conteudo: 'Se a lista mostra **Nenhum paciente elegível para recálculo no momento.** ou o paciente não aparece, ele já passou do primeiro ciclo.',
      },
    ],
  },

  // ===================================================================
  // TABELAS CADASTRAIS
  // ===================================================================
  {
    id: 'operadoras',
    grupo: 'cadastros',
    titulo: 'Operadoras',
    icone: 'LuShield',
    caminho: '/operadoras',
    quem: 'Perfis com o módulo Operadoras',
    resumo: 'Cadastre, edite, desative e reative as operadoras de saúde atendidas.',
    palavrasChave: ['operadora', 'cnpj', 'e-mails', 'desativar', 'reativar', 'plano de saúde'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como cadastrar uma operadora',
        itens: [
          'Clique em **+ Nova Operadora**.',
          'Preencha **Nome da Operadora**, **CNPJ** e **Telefone**.',
          'Em **E-mails (Separe por vírgula)**, informe um ou mais e-mails separados por vírgula.',
          'Clique em **Salvar**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Outras ações',
        itens: [
          '**Editar**: altera os dados.',
          '**Desativar** / **Reativar**: muda o status entre **Ativa** e **Inativa**. O sistema pede confirmação.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Operadoras criadas no login',
        conteudo: 'Quando alguém de uma operadora nova entra pela primeira vez, o sistema cria a operadora a partir do sistema de compras. Depois, complete CNPJ, telefone e e-mails aqui.',
      },
    ],
  },

  {
    id: 'usuarios',
    grupo: 'cadastros',
    titulo: 'Usuários',
    icone: 'LuUsers',
    caminho: '/users',
    quem: 'Perfis com o módulo Usuários e Perfis',
    resumo: 'Consulte os usuários, defina o perfil de acesso de cada um e veja as operadoras ligadas.',
    palavrasChave: ['usuário', 'perfil', 'grupo', 'inativar', 'operadoras', 'acesso'],
    blocos: [
      {
        tipo: 'texto',
        titulo: 'Para que serve',
        conteudo: 'A tela **Gerenciamento de Usuários** lista quem usa o sistema, com **Acesso (Grupo)**, **Operadoras** e **Status**. Usuários da CIC Farma mostram a marca **CiCFARMA**. Use a busca e marque **Exibir Inativos** para ver também os inativos.',
      },
      {
        tipo: 'passos',
        titulo: 'Como mudar o perfil de um usuário',
        itens: [
          'Clique em **Editar** na linha do usuário.',
          'Em **Perfil de Acesso (Grupo)**, escolha o perfil.',
          'Clique em **Salvar**.',
          'Peça para a pessoa recarregar a página. O menu passa a mostrar as telas do novo perfil.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'O que vem do sistema de compras',
        conteudo: 'Os usuários entram com o login do sistema de compras e são criados automaticamente no primeiro acesso. A cada login, o sistema atualiza nome, operadora e status a partir do sistema de compras. Por isso, mudanças em **Acesso às Operadoras** e em **Inativar** / **Reativar** podem ser desfeitas no próximo login da pessoa. A **Senha** do formulário de **+ Novo Usuário** não é usada para entrar. O perfil de acesso é mantido.',
      },
      {
        tipo: 'atencao',
        titulo: 'Quem não é administrador só concede o que tem',
        conteudo: 'Só um **administrador** cria outro administrador, altera ou inativa um administrador e muda o perfil e as operadoras de si mesmo. Quem tem o módulo **Usuários e Perfis** sem ser administrador só pode dar a outra pessoa um perfil com permissões que ele também tem e só pode ligá-la às operadoras que ele também acessa. Se tentar mais do que isso, o sistema mostra o motivo e não salva.',
      },
    ],
  },

  {
    id: 'permissoes',
    grupo: 'cadastros',
    titulo: 'Permissões (perfis de acesso)',
    icone: 'LuLock',
    caminho: '/permissoes',
    quem: 'Perfis com o módulo Usuários e Perfis',
    resumo: 'Crie perfis e defina, módulo por módulo, quem pode acessar, editar e excluir.',
    palavrasChave: ['perfil', 'permissão', 'acessar', 'editar', 'excluir', 'módulo', 'grupo', 'acesso'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como criar ou editar um perfil',
        itens: [
          'Na tela **Gestão de Perfis de Acesso**, clique na aba **Novo Perfil**. Para editar, clique no ícone **Editar Permissões** na **Listagem**.',
          'Preencha o **Nome do Perfil (Ex: Médico, Enfermeiro, Recepção)**.',
          'Na tabela, marque para cada **Módulo do Sistema** as colunas **Acessar (Ler)**, **Editar (Criar/Alterar)** e **Excluir (Deletar)**.',
          'Clique em **Criar Perfil** ou **Salvar Alterações**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'O que cada coluna libera',
        itens: [
          '**Acessar (Ler)**: o item aparece no menu e a pessoa consulta os dados.',
          '**Editar (Criar/Alterar)**: a pessoa cadastra e altera. Por exemplo, sincronizar pacientes, enviar termo ou mandar mensagem no chat.',
          '**Excluir (Deletar)**: a pessoa apaga registros. Por exemplo, apagar uma conversa do chat.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Módulos que mudam o menu',
        itens: [
          '**Dashboard**, **Telemonitoramento**, **Linha do Tempo**, **Recálculo (Atendimento)**, **Operadoras**, **Auditoria**, **Faturamento**, **Termos Assinados**, **Falhas de Contato** e **Motivos de Pausa/Descontinuação**: a tela de mesmo nome.',
          '**Questionários e Avaliações**: Necessidade de Navegação, Questionários e os alertas de avaliação.',
          '**Usuários e Perfis**: Usuários e Permissões.',
          '**Reação Adversa**: Ficha RAM.',
          '**Chat**: o botão verde do chat.',
          '**Saúde do NPS**: o indicador **Status NPS (WhatsApp)**.',
          '**Fechar Mês (Dashboard)**: o botão de fechar o mês anterior.',
          '**Pacientes (sincronização)** e **Termos de Aceite**: ações dentro de Necessidade de Navegação, como sincronizar, pausar e enviar termo.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Combine os módulos de atendimento',
        conteudo: 'Quem atende pacientes precisa de vários módulos juntos. Para usar Necessidade de Navegação por completo, libere **Questionários e Avaliações**, **Pacientes (sincronização)** e **Termos de Aceite**. Sem eles, a tela abre mas botões como **Sincronizar** e **Termo** dão erro.',
      },
      {
        tipo: 'atencao',
        titulo: 'Limite para quem não é administrador',
        conteudo: 'Quem não é **administrador** só cria ou edita perfis com permissões que ele mesmo tem e não altera o perfil usado pelos administradores.',
      },
    ],
  },

  {
    id: 'questionarios',
    grupo: 'cadastros',
    titulo: 'Questionários',
    icone: 'LuClipboardList',
    caminho: '/questionarios',
    quem: 'Perfis com o módulo Questionários e Avaliações',
    resumo: 'Monte os modelos de questionário: perguntas, opções, pontuação e categorias. Ative ou desative cada modelo.',
    palavrasChave: ['questionário', 'modelo', 'template', 'perguntas', 'opções', 'pontuação', 'categoria', 'ativar', 'desativar', 'orientação'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como montar um questionário',
        itens: [
          'Na tela **Questionários & Avaliações**, clique em **+ Novo Questionário**.',
          'Preencha o **Título do Questionário** e, se quiser, a **Descrição (Opcional)**.',
          'Em cada item, escolha a **Categoria (Opcional)**. Itens da mesma categoria viram uma etapa no preenchimento.',
          'Escolha o **Tipo do Item**: **Texto Livre**, **Múltipla Escolha** ou **Orientação / Observação (Sem resposta)**.',
          'Escreva o **Enunciado da Pergunta** (ou o **Texto da Orientação**).',
          'Em múltipla escolha, use **Adicionar Opção** e preencha o critério e os pontos (**Pts**) de cada opção.',
          'Use **Adicionar Novo Item** para incluir mais perguntas.',
          'Clique em **Salvar Questionário**.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Na lista de questionários',
        itens: [
          '**Detalhes** / **Fechar**: mostra a **Estrutura do Formulário**, com as perguntas, o tipo e os pontos.',
          '**Editar**: só aparece enquanto ninguém respondeu o questionário.',
          '**Desativar** / **Ativar**: questionários inativos não são oferecidos aos pacientes.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'Questionário respondido fica travado',
        conteudo: 'Depois da primeira resposta, o questionário não pode mais ser editado. Isso protege o histórico dos pacientes. Para mudar algo, desative o questionário e crie um novo.',
      },
      {
        tipo: 'dica',
        titulo: 'A régua de pontuação',
        conteudo: 'A classificação de adesão usa a soma dos pontos: até 9 alta, de 10 a 12 média, 13 ou mais baixa. Monte a pontuação das opções pensando nessa régua.',
      },
    ],
  },

  {
    id: 'ficha-ram',
    grupo: 'cadastros',
    titulo: 'Ficha RAM (reações adversas)',
    icone: 'LuFileWarning',
    caminho: '/ficha-ram',
    quem: 'Perfis com o módulo Reação Adversa',
    resumo: 'Mantenha a lista de reações adversas usada nos contatos. Cadastre uma a uma ou importe uma planilha.',
    palavrasChave: ['ram', 'reação adversa', 'efeito colateral', 'importar', 'excel', 'planilha'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como cadastrar uma reação',
        itens: [
          'Na tela **Gestão de Reações Adversas (RAM)**, clique na aba **Nova Reação**.',
          'Preencha **Nome da Reação Adversa**.',
          'Clique em **Cadastrar**.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Como importar uma planilha',
        itens: [
          'Clique na aba **Importar Base (Excel)**.',
          'Prepare uma planilha .xlsx com uma coluna chamada **nome**, **name** ou **Reação**.',
          'Selecione o arquivo. O sistema mostra o **Relatório de Pré-Importação**, com **Novos itens** e **Itens já existentes**.',
          'Clique em **Confirmar e Salvar no Banco**. Só os nomes novos são adicionados.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Desativar em vez de apagar',
        conteudo: 'Na **Listagem**, use **Editar** para corrigir o nome e **Desativar** para tirar a reação da lista dos contatos. Os registros antigos não mudam.',
      },
    ],
  },

  {
    id: 'falhas-de-contato',
    grupo: 'cadastros',
    titulo: 'Falhas de Contato',
    icone: 'LuPhone',
    caminho: '/motivos-falha-contato',
    quem: 'Perfis com o módulo Falhas de Contato',
    resumo: 'Lista de motivos que você escolhe quando o contato com o paciente não dá certo.',
    palavrasChave: ['falha', 'contato sem sucesso', 'não atendeu', 'motivo'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como cadastrar um motivo',
        itens: [
          'Na tela **Gerenciar Motivos de Falha de Contato**, clique em **Novo Motivo**.',
          'Preencha a **Descrição do Motivo**. Exemplo: Paciente não atendeu.',
          'Deixe marcado **Motivo está ativo para uso?**.',
          'Clique em **Salvar**.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Onde os motivos aparecem',
        conteudo: 'Os motivos ativos aparecem em **Qual o motivo da falha no contato?** no Telemonitoramento. No Dashboard, o gráfico **Problemas de Contato (Motivos de Falha)** conta as falhas por motivo.',
      },
      {
        tipo: 'dica',
        titulo: 'Inative em vez de criar parecidos',
        conteudo: 'Use **Inativar** para tirar um motivo da lista sem perder o histórico. Evite motivos com o mesmo sentido escritos de jeitos diferentes: isso divide a contagem no Dashboard.',
      },
    ],
  },

  {
    id: 'motivos-pausa',
    grupo: 'cadastros',
    titulo: 'Motivos de Pausa/Descontinuação',
    icone: 'LuCirclePause',
    caminho: '/motivos-pausa-tratamento',
    quem: 'Perfis com o módulo Motivos de Pausa/Descontinuação',
    resumo: 'Lista única de motivos usada para pausar tratamento, pausar medicamento e descontinuar medicamento.',
    palavrasChave: ['motivo', 'pausa', 'descontinuação', 'encerramento', 'internação'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como cadastrar um motivo',
        itens: [
          'Na tela **Gerenciar Motivos de Pausa / Descontinuação de Tratamento**, clique em **Novo Motivo**.',
          'Preencha a **Descrição do Motivo**. Exemplo: Internação hospitalar.',
          'Deixe marcado **Motivo está ativo para uso?**.',
          'Clique em **Salvar**.',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Onde os motivos aparecem',
        conteudo: 'A mesma lista aparece em três lugares: **Pausar Tratamento** (Necessidade de Navegação), **Pausar Temporariamente** e **Motivo do encerramento** (Telemonitoramento). Usar uma lista só deixa a contagem dos motivos consistente.',
      },
      {
        tipo: 'dica',
        titulo: 'Lista vazia na hora de pausar?',
        conteudo: 'Se aparecer **Nenhum motivo cadastrado — cadastre em Tabelas Cadastrais**, não há motivo ativo. Cadastre ou ative um motivo aqui.',
      },
    ],
  },

  // ===================================================================
  // ADMINISTRATIVO
  // ===================================================================
  {
    id: 'auditoria',
    grupo: 'admin',
    titulo: 'Auditoria',
    icone: 'LuLogs',
    caminho: '/auditoria',
    quem: 'Perfis com o módulo Auditoria',
    resumo: 'Veja quem fez cada ação no sistema, filtre por usuário, paciente, período, módulo ou tipo de ação, e exporte para Excel.',
    palavrasChave: ['auditoria', 'log', 'histórico', 'rastreio', 'quem fez', 'exportar', 'excel'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como pesquisar',
        itens: [
          'Na tela **Auditoria e Rastreio do Sistema**, abra a aba **Selecionar Usuário**.',
          'Busque em **Nome do Usuário** e clique em **Histórico** na linha da pessoa. Para ver ações de todos os usuários sobre um paciente, vá direto para a aba de histórico.',
          'Use os filtros **Paciente (id, nome ou CPF)**, **Data Início**, **Data Fim**, **Módulo** e **Tipo de Ação**.',
          'Clique na lupa (**Buscar**). Para recomeçar, clique em **Limpar Filtros**.',
          'Clique em **Exportar para Excel** para baixar o resultado.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'O que a tabela mostra',
        itens: [
          '**Data / Hora**, **Usuário**, **Paciente**, **Módulo afetado**, **Ação Realizada** e **Detalhes da Operação**.',
          'Ações feitas automaticamente aparecem com o usuário **Sistema**.',
          'Tipos de ação: Criação, Edição, Exclusão, Emissão, Envio, Sincronização, Acesso (Login) e Inserção Manual.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Exemplos de uso',
        conteudo: 'Descubra quem enviou um termo, quem pausou um paciente, quem descontinuou um medicamento ou quando uma compra foi deixada sem aplicar e por qual motivo.',
      },
    ],
  },

  {
    id: 'faturamento',
    grupo: 'admin',
    titulo: 'Faturamento',
    icone: 'LuDollarSign',
    caminho: '/faturamento',
    quem: 'Perfis com o módulo Faturamento',
    resumo: 'Consolidação financeira dos medicamentos acompanhados no período, com cálculo de comissão.',
    palavrasChave: ['faturamento', 'comissão', 'valor', 'cobrança', 'operadora', 'sem acompanhamento', 'tuss', 'xlsx'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como consultar',
        itens: [
          'A tela **Faturamento & Comissões** abre com o mês atual e comissão de 10%.',
          'Ajuste **Busca de Paciente**, **Operadora**, **Data Início**, **Data Fim**, **Origem** e **% Comissão**.',
          'Clique em **Filtrar Dados**.',
          'Veja os cartões **Total Faturado**, **Total Comissão**, **Qtd. Atendimentos**, **Sem acompanhamento**, **Total Geral** e **Comissão Geral**.',
          'Clique em **Exportar XLSX** para baixar o relatório.',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Regras do cálculo',
        itens: [
          'O período considera a data de administração do medicamento. Ciclos sem data de administração não entram.',
          'Cada combinação de paciente e medicamento aparece uma vez no período.',
          'O valor é o preço do medicamento vezes a quantidade de caixas. A comissão é o percentual informado sobre esse total.',
          '**Origem**: **Monitorado** para ciclos acompanhados e **Sem acompanhamento** para compras confirmadas como já utilizadas, sem ciclo próprio. Filtre com **Só monitorados (ciclos)** ou **Só processados sem acompanhamento**.',
        ],
      },
      {
        tipo: 'dica',
        titulo: 'Compras sem acompanhamento',
        conteudo: 'Passe o mouse sobre **Sem acompanhamento** para ver quando e por quem a compra foi processada. Elas surgem quando alguém confirma, no contato ou na configuração inicial, que uma compra anterior já foi usada.',
      },
    ],
  },

  {
    id: 'termos-assinados',
    grupo: 'admin',
    titulo: 'Termos Assinados',
    icone: 'LuFileSearch',
    caminho: '/termo',
    quem: 'Perfis com o módulo Termos Assinados',
    resumo: 'Consulte os termos aceitos, baixe o documento de cada paciente e crie novas versões do texto do termo.',
    palavrasChave: ['termo', 'assinado', 'versão', 'pdf', 'baixar', 'nova versão', 'texto do termo'],
    blocos: [
      {
        tipo: 'passos',
        titulo: 'Como consultar um termo aceito',
        itens: [
          'Abra **Termos Assinados**. Você vê a tela **Gestão de Termos Assinados**.',
          'Na tabela, veja **Paciente**, **Operadora**, **Versão do Termo** e **Data da Assinatura**.',
          'Clique em **Visualizar / Baixar** para abrir o documento do paciente.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Como criar uma nova versão do termo',
        itens: [
          'Confira a **Versão ativa do termo**, no topo.',
          'Clique em **Criar Nova Versão**.',
          'Preencha **Título do documento**, **Introdução**, **Texto de autorização**, **Finalidades (uma por linha)**, o texto **declaro estar ciente de que** e **Itens de ciência (um por linha)**.',
          'Escreva **{OPERADORA}** na introdução onde o nome da operadora do paciente deve aparecer.',
          'Clique em **Criar e Ativar Versão** e confirme.',
        ],
      },
      {
        tipo: 'atencao',
        titulo: 'A nova versão não muda o passado',
        conteudo: 'A versão nova vale para os próximos aceites. Quem já aceitou continua ligado à versão que realmente viu. Revise o texto antes de ativar.',
      },
    ],
  },

  // ===================================================================
  // DÚVIDAS FREQUENTES
  // ===================================================================
  {
    id: 'perguntas-frequentes',
    grupo: 'duvidas',
    titulo: 'Perguntas frequentes',
    icone: 'LuCircleHelp',
    caminho: null,
    quem: 'Todos os usuários',
    resumo: 'Respostas rápidas para as dúvidas mais comuns do dia a dia.',
    palavrasChave: ['dúvidas', 'perguntas', 'problema', 'não aparece', 'ajuda', 'faq'],
    blocos: [
      {
        tipo: 'texto',
        conteudo: 'Clique em uma pergunta para ver a resposta. Para o passo a passo completo, abra o tópico da tela correspondente.',
      },
      {
        tipo: 'faq',
        itens: [
          {
            pergunta: 'O paciente novo não aparece em Necessidade de Navegação. Por quê?',
            resposta: 'Clique em **Sincronizar**. Se ele continuar fora, abra a faixa amarela de pacientes que não sincronizaram e veja o motivo. Só entram pacientes cadastrados para Navegação Oncológica no sistema de compras, com compra de medicamento válida. Confira também o contador: a tela abre em **Não Enviados**, e pacientes de outros status ficam em outros círculos.',
          },
          {
            pergunta: 'O paciente aceitou o termo, mas não aparece no Telemonitoramento.',
            resposta: 'O paciente entra no Telemonitoramento só depois do questionário e da **Configuração de Uso Contínuo**. Clique em **Avaliar**, responda o questionário e preencha a configuração até **Confirmar Monitoramentos**. Confira também se o tratamento não está pausado.',
          },
          {
            pergunta: 'O link do termo não chegou para o paciente. O que faço?',
            resposta: 'Confira o número escolhido em **Selecione o destinatário do link:**. Se o paciente tem cuidador, o envio vai para o cuidador por padrão. Tente outra forma: **Digitar um número de WhatsApp manualmente**, **Enviar link por E-mail** ou **Gerar e copiar link (envio manual)**. Se o link foi para a pessoa errada, use **Cancelar Termo** antes de reenviar. Veja também a qualidade do WhatsApp em **Status NPS (WhatsApp)**.',
          },
          {
            pergunta: 'O paciente abriu o link e apareceu "Link Indisponível". Por quê?',
            resposta: 'Cada link do termo é único e vale só enquanto o termo está aguardando resposta. Ele deixa de abrir quando o termo é cancelado, quando você reenvia depois de o paciente já ter respondido (o envio gera um link novo) ou quando é um link antigo, enviado antes de 17/11/2026, que não foi respondido até 16/12/2026. Reenvie o termo pela tela **Necessidade de Navegação**. Enquanto o termo está aguardando resposta, reenviar (por exemplo, para o cuidador) mantém o mesmo link, então o link que o paciente já recebeu continua valendo.',
          },
          {
            pergunta: 'O paciente aceitou por telefone. Como registro?',
            resposta: 'Na janela de espera do termo, clique em **Registrar Aceite Manual (Telefone / Conversa)** e responda **SIM**.',
          },
          {
            pergunta: 'Cadastrei a posologia errada. Como corrijo?',
            resposta: 'Se o medicamento ainda está no primeiro ciclo, use a tela **Recálculo**. Depois do primeiro contato, corrija em **Registrar Contato**, marcando **Houve alteração da posologia (dosagem) no meio deste ciclo?**. Para a data de início, use o botão **Corrigir** ao lado da data de administração.',
          },
          {
            pergunta: 'Por que o número do Dashboard não mudou depois de eu corrigir um dado?',
            resposta: 'Se o filtro cobre um mês inteiro já fechado, do dia 1 ao último dia, o painel mostra a fotografia guardada no fechamento. O mês anterior fecha sozinho no dia 3. Outros períodos são calculados na hora: clique em **Filtrar** de novo.',
          },
          {
            pergunta: 'Abri Registrar Contato e apareceu "Paciente em Atendimento".',
            resposta: 'Outra pessoa está registrando contato desse paciente. Espere ela terminar e tente de novo. Se a janela dela fechou de repente, a reserva expira sozinha em até 20 minutos.',
          },
          {
            pergunta: 'O paciente não atendeu. O que acontece com o contato?',
            resposta: 'Marque **Não (Paciente não atendeu/ausente)**, escolha o motivo e clique em **Registrar Falha de Contato**. O contato é reagendado para o próximo dia útil.',
          },
          {
            pergunta: 'Por que a adesão veio baixa se o paciente diz que toma certinho?',
            resposta: 'A adesão compara os comprimidos informados com o **Estoque Projetado para Hoje**. Se a data de início ou a posologia estiver errada, a projeção fica errada. Confira a data de administração (botão **Corrigir**) e o padrão de posologia antes de digitar a quantidade.',
          },
          {
            pergunta: 'O paciente sumiu do Telemonitoramento.',
            resposta: 'Veja se ele está com o tratamento pausado (contador **⏸ Pausados** em Necessidade de Navegação), se o medicamento está pausado (**⏸ Ver pausados temporariamente**) ou se todos os medicamentos foram descontinuados (**Mostrar apenas pacientes com acompanhamento encerrado**). A busca procura só pelo nome.',
          },
          {
            pergunta: 'Chegou uma compra nova, mas o paciente ainda está na caixa antiga.',
            resposta: 'Não marque a aplicação da compra. Em **Motivo para não aplicar esta compra agora**, escolha **Paciente ainda está usando a caixa anterior (aplicar no próximo contato)**. A compra volta no próximo contato.',
          },
          {
            pergunta: 'O medicamento acabou e não chegou compra nova.',
            resposta: 'Se o paciente comprou por conta e a operadora reembolsou, use **Criar Evento Reembolso**. O botão aparece quando a estimativa de comprimidos chega a zero.',
          },
          {
            pergunta: 'Não consigo mandar mensagem no chat.',
            resposta: 'Se aparece **Janela Expirada (Inativa)**, passaram 24 horas da última mensagem do paciente. Reabra com **Reabrir com Termo** ou **Reabrir com NPS** (tem custo). Se o tratamento do paciente está pausado, retome antes. Seu perfil também precisa da permissão de editar no módulo **Chat**.',
          },
          {
            pergunta: 'Uma tela sumiu do meu menu.',
            resposta: 'O menu segue o seu perfil de permissões. Peça ao administrador para conferir seu perfil em **Permissões** e **Usuários**. Depois de uma mudança, recarregue a página.',
          },
          {
            pergunta: 'Coloquei um termo em 2º plano e não recebi o aviso.',
            resposta: 'O aviso de termo aceito é conferido enquanto a tela **Necessidade de Navegação** está aberta. Volte a ela e aguarde alguns segundos. Você também pode clicar em **Aguardando** na linha do paciente para ver a situação.',
          },
        ],
      },
    ],
  },
];
