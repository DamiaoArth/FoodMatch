'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardMedia
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';

const ReceitaImage = styled(CardMedia)`
  height: 300px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 5rem;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ReceitaDetailPaper = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
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

type ReceitaType = {
  id: number;
  nome: string;
  ingredientes: string;
  tempo_preparo: number;
  calorias_totais: number;
  imagem?: string;
};

export default function ReceitaDetalhe() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [receita, setReceita] = useState<ReceitaType | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [removendo, setRemovendo] = useState(false);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated && id) {
      fetchReceita();
    }
  }, [isAuthenticated, loading, router, id]);
  
  const fetchReceita = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`/api/recipes/receitas/${id}/`, { headers });
      setReceita(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da receita:', error);
      setError('Não foi possível carregar os detalhes da receita.');
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleRemoverReceita = async () => {
    if (!confirm('Tem certeza que deseja remover esta receita?')) {
      return;
    }
    
    try {
      setRemovendo(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`/api/recipes/receitas/${id}/delete`, { headers });
      router.push('/receitas');
    } catch (error) {
      console.error('Erro ao remover receita:', error);
      alert('Não foi possível remover a receita. Tente novamente.');
      setRemovendo(false);
    }
  };
  
  const formatIngredientes = (ingredientes: string) => {
    return ingredientes.split('\n').map((item, index) => (
      <ListItem key={index} sx={{ py: 0.5 }}>
        <ListItemText primary={item.trim()} />
      </ListItem>
    ));
  };
  
  if (loading || loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/receitas')}
            sx={{ mt: 2 }}
          >
            Voltar para Receitas
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!receita) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Receita não encontrada
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/receitas')}
            sx={{ mt: 2 }}
          >
            Voltar para Receitas
          </Button>
        </Box>
      </Container>
    );
  }
  
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
        {receita.nome}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {receita.imagem ? (
            <ReceitaImage
              image={receita.imagem}
              title={receita.nome}
            />
          ) : (
            <ReceitaImage>
              🍽️
            </ReceitaImage>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ReceitaDetailPaper elevation={2}>
            <SectionTitle>
              Ingredientes
            </SectionTitle>
            
            <List dense>
              {formatIngredientes(receita.ingredientes)}
            </List>
          </ReceitaDetailPaper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ReceitaDetailPaper elevation={2}>
            <SectionTitle>
              Informações
            </SectionTitle>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Tempo de preparo: {receita.tempo_preparo} minutos
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalFireDepartmentIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Calorias: {receita.calorias_totais} kcal
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Chip 
                label="Salvar Receita" 
                color="primary" 
                variant="outlined" 
                onClick={() => alert('Funcionalidade em desenvolvimento')}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label="Adicionar ao Carrinho" 
                color="secondary" 
                variant="outlined"
                onClick={() => alert('Funcionalidade em desenvolvimento')}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label="Remover Receita" 
                color="error" 
                variant="outlined"
                onClick={handleRemoverReceita}
                disabled={removendo}
                sx={{ mr: 1, mb: 1 }}
              />
            </Box>
          </ReceitaDetailPaper>
        </Grid>
      </Grid>
    </Container>
  );
}