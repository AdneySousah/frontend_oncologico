import axios from 'axios';

const api = axios.create({
    baseURL: 'http://72.60.253.54:3002',
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
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // LIMPA A CHAVE CORRETA PARA DESLOGAR DE VEZ
            localStorage.removeItem('oncologico:UserData'); 
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;