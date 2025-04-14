'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Configuração global do axios
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

type User = {
  id: number;
  email: string;
  nome: string;
  objetivo_nutricional?: string;
  renda?: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (nome: string, email: string, password: string) => Promise<void>;
  changePassword: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Configurar o token no cabeçalho de autorização
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Buscar informações do usuário
          const response = await axios.get('/api/users/me/');          
          setUser(response.data);
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Limpar qualquer token anterior
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Verificar se o email e senha foram fornecidos
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      // Usar axios.post para garantir que os dados são enviados no corpo da requisição e não na URL
      const response = await axios.post('/api/token/', 
        { email, password }, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          // Desativar a serialização de parâmetros na URL
          params: {}
        }
      );
      
      const { access, refresh } = response.data;
      
      // Armazenar tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Configurar o token no cabeçalho de autorização
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Buscar informações do usuário
      const userResponse = await axios.get('/api/users/me/');
      setUser(userResponse.data);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      // Melhorar as mensagens de erro
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Email ou senha incorretos');
        } else if (error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        }
      }
      
      throw error;
    }
  };

  const logout = () => {
    // Remover tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Remover cabeçalho de autorização
    delete axios.defaults.headers.common['Authorization'];
    
    // Limpar estado do usuário
    setUser(null);
  };

  const register = async (nome: string, email: string, password: string) => {
    try {
      // Limpar qualquer token anterior
      delete axios.defaults.headers.common['Authorization'];
      
      // Verificar se todos os campos foram fornecidos
      if (!nome || !email || !password) {
        throw new Error('Nome, email e senha são obrigatórios');
      }
      
      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Por favor, insira um email válido');
      }
      
      // Validar senha
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      
      // Registrar novo usuário
      const registerResponse = await axios.post('/api/users/register/', { nome, email, password });
      
      if (registerResponse.status !== 201) {
        throw new Error('Erro ao registrar usuário');
      }
      
      // Fazer login após o registro
      await login(email, password);
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      
      // Melhorar as mensagens de erro
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.email) {
            throw new Error(`Email: ${error.response.data.email[0]}`);
          } else if (error.response.data.password) {
            throw new Error(`Senha: ${error.response.data.password[0]}`);
          } else if (error.response.data.nome) {
            throw new Error(`Nome: ${error.response.data.nome[0]}`);
          } else if (error.response.data.detail) {
            throw new Error(error.response.data.detail);
          }
        }
      }
      
      throw error;
    }
  };

  const changePassword = async (password: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      // Configurar o token no cabeçalho de autorização
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fazer a requisição para alterar a senha
      // Enviando password e password_confirm como campos separados
      const response = await axios.post('/api/users/change-password/', 
        { password, password_confirm: password }, 
        { headers }
      );
      
      if (response.status !== 200) {
        throw new Error('Erro ao alterar senha');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Rota não encontrada. Verifique a URL de alteração de senha.');
        } else if (error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        }
      }
      
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}