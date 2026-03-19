import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('oncologico:UserData');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            setUser(userData);
        }
    }, []);

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
        localStorage.removeItem('oncologico:UserData');
        setUser(null);
        api.defaults.headers.common['Authorization'] = undefined;
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, Login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;