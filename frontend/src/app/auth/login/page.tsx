'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Criando um tema personalizado
const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem'
    }
  },
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    }
  }
});

// Estilizando o Paper para o formulário de login
const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  margin: '2rem auto',
  maxWidth: '450px',
  background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,0.95) 100%)'
}));

export default function Login() {
  // Inicializar estados com valores vazios, ignorando qualquer parâmetro da URL
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Previne o comportamento padrão do formulário para evitar que os dados sejam enviados via URL
    e.preventDefault();
    
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }
    
    try {
      // Chamar a função de login do contexto de autenticação
      // Usando valores diretamente dos estados para evitar problemas com a URL
      const emailValue = email.trim();
      const passwordValue = password.trim();
      
      // Chamar a função de login diretamente, sem usar o formulário HTML para envio
      await login(emailValue, passwordValue);
      
      // Limpar os campos após o login bem-sucedido
      setEmail('');
      setPassword('');
      
      // Redirecionar para o dashboard após login bem-sucedido
      // Usando router.replace para evitar que o histórico mantenha a página de login
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Erro de login:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Credenciais inválidas. Verifique seu email e senha.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <LoginPaper elevation={3}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 600, color: '#2E7D32' }}>
            FoodMatch
          </Typography>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Entre com suas credenciais para acessar o FoodMatch
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            method="post"
            noValidate 
            sx={{ width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: '8px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                mt: 4, 
                mb: 3, 
                py: 1.5, 
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #43A047 0%, #7CB342 100%)',
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2">
                Não tem uma conta?{' '}
                <Link href="/auth/register" style={{ color: '#4CAF50', fontWeight: 500 }}>
                  Cadastre-se
                </Link>
              </Typography>
            </Box>
          </Box>
        </LoginPaper>
      </Container>
    </ThemeProvider>
  );
}

// Não é necessário importar styled novamente, já foi importado no início do arquivo