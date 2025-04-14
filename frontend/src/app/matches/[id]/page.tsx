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

const MatchImage = styled(CardMedia)`
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

const MatchDetailPaper = styled(Paper)`
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

type MatchType = {
  id: number;
  alimento: {
    id: number;
    nome: string;
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  bebida: {
    id: number;
    nome: string;
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  score_nutricional: number;
  descricao?: string;
};

export default function MatchDetalhe() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [match, setMatch] = useState<MatchType | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated && id) {
      fetchMatch();
    }
  }, [isAuthenticated, loading, router, id]);
  
  const fetchMatch = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`/api/matches/${id}/`, { headers });
      setMatch(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do match:', error);
      setError('Não foi possível carregar os detalhes do match.');
    } finally {
      setLoadingData(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (loadingData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/matches')}
          sx={{ mb: 3 }}
        >
          Voltar para Matches
        </Button>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1">
            Tente novamente mais tarde ou entre em contato com o suporte.
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  if (!match) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/matches')}
          sx={{ mb: 3 }}
        >
          Voltar para Matches
        </Button>
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Match não encontrado
          </Typography>
          <Typography variant="body1">
            O match solicitado não existe ou foi removido.
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button 
        variant="outlined" 
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/matches')}
        sx={{ mb: 3 }}
      >
        Voltar para Matches
      </Button>
      
      <MatchDetailPaper elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <MatchImage>
              🍽️ + 🥤
            </MatchImage>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {match.alimento.nome} + {match.bebida.nome}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={`Score Nutricional: ${match.score_nutricional}`} 
                color={match.score_nutricional > 7 ? "success" : match.score_nutricional > 5 ? "warning" : "error"}
                sx={{ mr: 1 }}
              />
            </Box>
            
            {match.descricao && (
              <Typography variant="body1" paragraph>
                {match.descricao}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Informações Nutricionais Combinadas
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalFireDepartmentIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Calorias: {(Number(match.alimento.calorias) + Number(match.bebida.calorias)).toFixed(0)} kcal
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">
                  Proteínas: {(Number(match.alimento.proteinas) + Number(match.bebida.proteinas)).toFixed(1)}g
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">
                  Carboidratos: {(Number(match.alimento.carboidratos) + Number(match.bebida.carboidratos)).toFixed(1)}g
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">
                  Gorduras: {(Number(match.alimento.gorduras) + Number(match.bebida.gorduras)).toFixed(1)}g
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MatchDetailPaper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <MatchDetailPaper elevation={3}>
            <SectionTitle>Alimento</SectionTitle>
            
            <Typography variant="h6" gutterBottom>
              {match.alimento.nome}
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Calorias" 
                  secondary={`${match.alimento.calorias} kcal`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Proteínas" 
                  secondary={`${match.alimento.proteinas}g`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Carboidratos" 
                  secondary={`${match.alimento.carboidratos}g`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Gorduras" 
                  secondary={`${match.alimento.gorduras}g`} 
                />
              </ListItem>
            </List>
          </MatchDetailPaper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <MatchDetailPaper elevation={3}>
            <SectionTitle>Bebida</SectionTitle>
            
            <Typography variant="h6" gutterBottom>
              {match.bebida.nome}
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Calorias" 
                  secondary={`${match.bebida.calorias} kcal`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Proteínas" 
                  secondary={`${match.bebida.proteinas}g`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Carboidratos" 
                  secondary={`${match.bebida.carboidratos}g`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Gorduras" 
                  secondary={`${match.bebida.gorduras}g`} 
                />
              </ListItem>
            </List>
          </MatchDetailPaper>
        </Grid>
      </Grid>
    </Container>
  );
}