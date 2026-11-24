import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://10.1.0.8:3002',
    timeout: 60000,
});

const CHAVE_USUARIO = 'oncologico:UserData';

// Chaves com dados da sessão/pacientes que não podem sobrar para o próximo usuário
// do mesmo computador. NÃO entram aqui: 'oncologico:savedEmail' ("lembrar meu
// usuário") e 'appTheme' (tema), que são preferências do navegador.
const CHAVES_DA_SESSAO = [
    CHAVE_USUARIO,
    'oncologico:mailbox',
    'oncologico:nps_waiting',
    'oncologico:emSegundoPlano',
    'oncologico:savedPassword', // legado: versões antigas guardavam a senha
];

// Rotas abertas (paciente / recuperação de senha): um 401 nelas não pode mandar
// para o /login nem apagar a sessão de quem estiver logado no mesmo navegador.
const ROTAS_PUBLICAS = ['/login', '/reset', '/primeiro-acesso', '/paciente/termo/', '/paciente/nps/'];

function estaEmRotaPublica() {
    const caminho = window.location.pathname;
    return ROTAS_PUBLICAS.some((rota) => caminho === rota || caminho.startsWith(rota.endsWith('/') ? rota : `${rota}/`));
}

// Lê o usuário salvo sem quebrar se o storage estiver corrompido/inacessível.
export function lerUsuarioSalvo() {
    try {
        const bruto = localStorage.getItem(CHAVE_USUARIO);
        return bruto ? JSON.parse(bruto) : null;
    } catch {
        return null;
    }
}

// Apaga tudo que é da sessão (usado no logout e no 401).
export function limparDadosSessao() {
    CHAVES_DA_SESSAO.forEach((chave) => {
        try {
            localStorage.removeItem(chave);
        } catch {
            // storage inacessível: nada a limpar
        }
    });
    delete api.defaults.headers.common['Authorization'];
}

api.interceptors.request.use((config) => {
    // BUSCA NO LOCALSTORAGE (onde o AuthContext salva)
    const userData = lerUsuarioSalvo();

    if (userData?.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se o erro for 401 (Não autorizado)
        if (error.response && error.response.status === 401) {

            // EXCEÇÃO: Se o erro veio da rota de login (/session),
            // NÃO redireciona. Apenas rejeita a promessa para a tela de login tratar.
            if (error.config?.url?.includes('/session')) {
                return Promise.reject(error);
            }

            // Token expirado/inválido de um usuário logado: desloga de verdade.
            // Em tela pública (termo/NPS do paciente, reset, primeiro acesso) não mexe.
            // O interceptor fica fora do React, por isso o redirect é via window.location
            // (recarrega a página e zera o estado do AuthContext).
            if (!estaEmRotaPublica()) {
                limparDadosSessao();
                window.location.assign('/login');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
