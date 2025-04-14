'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Criando um tema personalizado consistente com o login
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

const steps = ['Informações básicas', 'Objetivos nutricionais'];

export default function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    // Validação do primeiro passo
    if (activeStep === 0) {
      if (!nome || !email || !password || !confirmPassword) {
        setError('Todos os campos são obrigatórios.');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleObjetivoChange = (event: SelectChangeEvent) => {
    setObjetivo(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Por favor, insira um email válido.');
      }

      // Validar senha
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      // Usar valores limpos para evitar problemas
      const nomeValue = nome.trim();
      const emailValue = email.trim();
      const passwordValue = password;

      // Chamar a função de registro diretamente
      await register(nomeValue, emailValue, passwordValue);
      
      // Atualizar objetivo nutricional se foi selecionado
      if (objetivo) {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('Token não encontrado');
          
          await axios.patch('http://localhost:8000/api/users/me/', 
            { objetivo_nutricional: objetivo },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Erro ao atualizar objetivo:', error);
          // Continuar mesmo se falhar ao atualizar o objetivo
        }
      }
      
      // Limpar os campos após o registro bem-sucedido
      setNome('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Usar router.replace para evitar histórico de navegação com dados sensíveis
      router.replace('/dashboard');
    } catch (err: any) {
      if (typeof err === 'string') {
        setError(err);
      } else if (err.message) {
        setError(err.message);
      } else if (err.response?.data) {
        const data = err.response.data;
        if (data.email) {
          setError(`Email: ${data.email[0]}`);
        } else if (data.password) {
          setError(`Senha: ${data.password[0]}`);
        } else if (data.nome) {
          setError(`Nome: ${data.nome[0]}`);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError('Erro ao criar conta. Verifique seus dados e tente novamente.');
        }
      } else {
        setError('Ocorreu um erro ao registrar. Tente novamente mais tarde.');
      }
      
      // Voltar para o primeiro passo em caso de erro
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            padding: { xs: '2rem', sm: '2.5rem' },
            margin: '2rem auto',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,0.95) 100%)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom 
            sx={{ 
              color: theme.palette.primary.main,
              mb: 2,
              background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            FoodMatch
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ color: '#333333' }}
          >
            Cadastro
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary" 
            paragraph 
            sx={{ mb: 4, maxWidth: '400px', mx: 'auto' }}
          >
            Crie sua conta no FoodMatch e comece a melhorar sua alimentação
          </Typography>
          
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.primary.main
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '8px',
                '& .MuiAlert-icon': {
                  color: '#d32f2f'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" method="post" onSubmit={activeStep === steps.length - 1 ? handleSubmit : undefined} noValidate>
            {activeStep === 0 ? (
              // Passo 1: Informações básicas
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nome"
                  label="Nome completo"
                  name="nome"
                  autoComplete="name"
                  autoFocus
                  value={nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
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
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar senha"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </>
            ) : (
              // Passo 2: Objetivos nutricionais
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="objetivo-label">Objetivo Nutricional</InputLabel>
                <Select
                  labelId="objetivo-label"
                  id="objetivo"
                  value={objetivo}
                  label="Objetivo Nutricional"
                  onChange={handleObjetivoChange}
                  disabled={loading}
                  sx={{
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="emagrecimento">Emagrecimento</MenuItem>
                  <MenuItem value="hipertrofia">Hipertrofia</MenuItem>
                  <MenuItem value="saude">Saúde e Bem-estar</MenuItem>
                  <MenuItem value="restricao">Restrição Alimentar</MenuItem>
                </Select>
              </FormControl>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: activeStep === 0 ? 'flex-end' : 'space-between', mt: 4 }}>
              {activeStep !== 0 && (
                <Button
                  onClick={handleBack}
                  disabled={loading}
                  sx={{
                    borderRadius: '10px',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.04)'
                    }
                  }}
                >
                  Voltar
                </Button>
              )}
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={loading || !objetivo}
                  sx={{ 
                    borderRadius: '10px',
                    borderWidth: '2px',
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3,
                    textTransform: 'none',
                    background: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: '#2E7D32',
                      color: '#2E7D32',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#4CAF50' }} /> : 'Finalizar Cadastro'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="outlined"
                  disabled={loading || !nome || !email || !password || !confirmPassword}
                  sx={{ 
                    borderRadius: '10px',
                    borderWidth: '2px',
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3,
                    textTransform: 'none',
                    background: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: '#2E7D32',
                      color: '#2E7D32',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                    }
                  }}
                >
                  Próximo
                </Button>
              )}
            </Box>
            
            {activeStep === 0 && (
              // In the JSX where the link appears:
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2">
                  Já tem uma conta?{' '}
                  <MuiLink 
                    component={NextLink}
                    href="/auth/login" 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      fontWeight: 500,
                      textDecoration: 'none',
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderBottomColor: theme.palette.primary.dark
                      }
                    }}
                  >
                    Faça login
                  </MuiLink>
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}