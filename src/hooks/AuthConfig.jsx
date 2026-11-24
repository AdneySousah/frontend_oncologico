import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { lerUsuarioSalvo, limparDadosSessao } from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    // Lê o usuário salvo já no primeiro render. lerUsuarioSalvo não quebra se o
    // storage estiver corrompido (devolve null). O token vai em cada requisição
    // pelo interceptor de services/api.js.
    const [user, setUser] = useState(() => {
        const userData = lerUsuarioSalvo();
        return userData?.token ? userData : null;
    });
    const navigate = useNavigate();

    async function Login(email, password) {
        try {
            // Guardamos a resposta inteira em vez de tentar desestruturar { data } direto,
            // pois se falhar, o código quebraria antes de chegar no catch
            const response = await toast.promise(
                api.post('/session', { email, password }),
                {
                    pending: 'Verificando suas credenciais...',
                    success: 'Acesso liberado!',
                    error: 'Erro ao fazer login. Verifique suas credenciais.',
                }
            );

            const { data } = response;
            localStorage.setItem('oncologico:UserData', JSON.stringify(data));
            setUser(data);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            // VERIFICAÇÃO DE PRIMEIRO ACESSO
            if (data.user.is_new_user) {
                navigate('/primeiro-acesso');
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error('Erro de autenticação:', error);
            // Lança o erro novamente para o LoginPage capturar e exibir a mensagem na tela
            throw error;
        }
    }

    const logout = () => {
        // Limpa o usuário e também mailbox / NPS em espera / termos em 2º plano
        // (têm nomes de pacientes e notas) — o próximo usuário do PC não pode ver.
        limparDadosSessao();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, Login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
