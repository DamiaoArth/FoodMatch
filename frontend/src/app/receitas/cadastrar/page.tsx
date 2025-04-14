'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  Grid,
  InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';

const FormPaper = styled(Paper)`
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

export default function CadastrarReceita() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [nome, setNome] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [tempoPreparo, setTempoPreparo] = useState('');
  const [calorias, setCalorias] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState('');
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Validação básica
    if (!nome || !ingredientes || !tempoPreparo || !calorias) {
      setMessage({ 
        type: 'error', 
        text: 'Por favor, preencha todos os campos obrigatórios.' 
      });
      return;
    }
    
    setLoadingSubmit(true);
    
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      
      // Criar FormData para envio de arquivos
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('ingredientes', ingredientes);
      formData.append('tempo_preparo', tempoPreparo);
      formData.append('calorias_totais', calorias);
      
      if (imagem) {
        formData.append('imagem', imagem);
      }
      
      // Enviar dados para a API
      await axios.post('/api/recipes/receitas/create/', formData, { headers });
      
      setMessage({ 
        type: 'success', 
        text: 'Receita cadastrada com sucesso!' 
      });
      
      // Limpar formulário
      setNome('');
      setIngredientes('');
      setTempoPreparo('');
      setCalorias('');
      setImagem(null);
      setImagemPreview('');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/receitas');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao cadastrar receita:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao cadastrar receita. Tente novamente.' 
      });
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/receitas')}
        >
          Voltar para Receitas
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Cadastrar Nova Receita
      </Typography>
      
      {message.text && (
        <Alert severity={message.type as 'success' | 'error'} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}
      
      <FormPaper elevation={2}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="nome"
                label="Nome da Receita"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loadingSubmit}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="ingredientes"
                label="Ingredientes"
                name="ingredientes"
                value={ingredientes}
                onChange={(e) => setIngredientes(e.target.value)}
                disabled={loadingSubmit}
                multiline
                rows={6}
                helperText="Liste os ingredientes separados por linha"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="tempoPreparo"
                label="Tempo de Preparo"
                name="tempoPreparo"
                type="number"
                value={tempoPreparo}
                onChange={(e) => setTempoPreparo(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">min</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="calorias"
                label="Calorias Totais"
                name="calorias"
                type="number"
                value={calorias}
                onChange={(e) => setCalorias(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
                disabled={loadingSubmit}
              >
                {imagemPreview ? 'Alterar Imagem' : 'Adicionar Imagem (Opcional)'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              
              {imagemPreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={imagemPreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                  />
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loadingSubmit}
                sx={{ mt: 2 }}
              >
                {loadingSubmit ? <CircularProgress size={24} /> : 'Cadastrar Receita'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormPaper>
    </Container>
  );
}