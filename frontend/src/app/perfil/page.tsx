'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment
} from '@mui/material';
import styled from 'styled-components';

const ProfilePaper = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled(Typography).attrs({
  component: 'h2',
  variant: 'h5'
})`
  margin-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #4CAF50;
  }
`;

export default function Perfil() {
  const { user, isAuthenticated, loading, changePassword } = useAuth();
  const router = useRouter();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [renda, setRenda] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user) {
      // Preencher os campos com os dados do usuário
      setNome(user.nome || '');
      setEmail(user.email || '');
      setObjetivo(user.objetivo_nutricional || '');
      setRenda(user.renda ? user.renda.toString() : '');
    }
  }, [isAuthenticated, loading, router, user]);
  
  const handleObjetivoChange = (event: SelectChangeEvent) => {
    setObjetivo(event.target.value);
  };
  
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoadingUpdate(true);
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Dados a serem atualizados
      const userData = {
        nome,
        objetivo_nutricional: objetivo,
        renda: renda ? parseFloat(renda) : null
      };
      
      await axios.patch('/api/users/me/', userData, { headers });
      setMessage({ 
        type: 'success', 
        text: 'Perfil atualizado com sucesso!' 
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao atualizar perfil. Tente novamente.' 
      });
    } finally {
      setLoadingUpdate(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Validação básica
    if (senha.length < 6) {
      setMessage({ 
        type: 'error', 
        text: 'A senha deve ter pelo menos 6 caracteres.' 
      });
      return;
    }
    
    if (senha !== confirmSenha) {
      setMessage({ 
        type: 'error', 
        text: 'As senhas não coincidem.' 
      });
      return;
    }
    
    setLoadingUpdate(true);
    
    try {
      // Usar a função do contexto de autenticação que já extraímos no início do componente
      await changePassword(senha);
      
      setMessage({ 
        type: 'success', 
        text: 'Senha atualizada com sucesso!' 
      });
      
      // Limpar campos de senha
      setSenha('');
      setConfirmSenha('');
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao atualizar senha. Tente novamente.' 
      });
    } finally {
      setLoadingUpdate(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Meu Perfil
      </Typography>
      
      {message.text && (
        <Alert severity={message.type as 'success' | 'error'} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProfilePaper elevation={2}>
            <SectionTitle>
              Informações Pessoais
            </SectionTitle>
            
            <Box component="form" onSubmit={handleUpdateProfile} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nome"
                label="Nome"
                name="nome"
                value={nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                disabled={loadingUpdate}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={email}
                disabled={true} // Email não pode ser alterado
                helperText="O email não pode ser alterado"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="objetivo-label">Objetivo Nutricional</InputLabel>
                <Select
                  labelId="objetivo-label"
                  id="objetivo"
                  value={objetivo}
                  label="Objetivo Nutricional"
                  onChange={handleObjetivoChange}
                  disabled={loadingUpdate}
                >
                  <MenuItem value=""><em>Nenhum</em></MenuItem>
                  <MenuItem value="Perda de peso">Perda de peso</MenuItem>
                  <MenuItem value="Ganho de massa muscular">Ganho de massa muscular</MenuItem>
                  <MenuItem value="Manutenção">Manutenção</MenuItem>
                  <MenuItem value="Alimentação saudável">Alimentação saudável</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                margin="normal"
                fullWidth
                id="renda"
                label="Renda Mensal"
                name="renda"
                type="number"
                value={renda}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenda(e.target.value)}
                disabled={loadingUpdate}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                helperText="Opcional - Ajuda a recomendar opções dentro do seu orçamento"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? <CircularProgress size={24} /> : 'Atualizar Perfil'}
              </Button>
            </Box>
          </ProfilePaper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ProfilePaper elevation={2}>
            <SectionTitle>
              Alterar Senha
            </SectionTitle>
            
            <Box component="form" onSubmit={handleUpdatePassword} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                name="senha"
                label="Nova Senha"
                type="password"
                id="senha"
                value={senha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                disabled={loadingUpdate}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmSenha"
                label="Confirmar Nova Senha"
                type="password"
                id="confirmSenha"
                value={confirmSenha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmSenha(e.target.value)}
                disabled={loadingUpdate}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? <CircularProgress size={24} /> : 'Atualizar Senha'}
              </Button>
            </Box>
          </ProfilePaper>
        </Grid>
      </Grid>
    </Container>
  );
}