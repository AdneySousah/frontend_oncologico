import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
    timeout: 60000,
});

api.interceptors.request.use((config) => {
    // BUSCA NO LOCALSTORAGE (onde o AuthContext salva)
    const userData = localStorage.getItem('oncologico:UserData');

    if (userData) {
        const { token } = JSON.parse(userData); // Extrai o token do JSON
        config.headers.Authorization = `Bearer ${token}`;
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
            if (error.config.url.includes('/session')) {
                return Promise.reject(error);
            }

            // Se não for a rota de login, significa que o token de um usuário logado expirou.
            // Aqui sim, fazemos o logout e recarregamos/redirecionamos a página.
            localStorage.removeItem('oncologico:UserData');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
