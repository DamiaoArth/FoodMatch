'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  CircularProgress,
  Paper
} from '@mui/material';
import styled from 'styled-components';

const DashboardHeader = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
`;

const StatsCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

type ReceitaType = {
  id: number;
  nome: string;
  tempo_preparo: number;
  calorias_totais: number;
};

type MatchType = {
  id: number;
  alimento: {
    id: number;
    nome: string;
  };
  bebida: {
    id: number;
    nome: string;
  };
  score_nutricional: number;
};

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [receitasRecentes, setReceitasRecentes] = useState<ReceitaType[]>([]);
  const [matchesRecomendados, setMatchesRecomendados] = useState<MatchType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, loading, router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Buscar receitas recentes
      const receitasResponse = await axios.get('/api/recipes/receitas/', { headers });
      setReceitasRecentes(receitasResponse.data.slice(0, 3)); // Mostrar apenas 3 receitas

      // Buscar matches recomendados
      const matchesResponse = await axios.get('/api/matches/recomendados/', { headers });
      setMatchesRecomendados(matchesResponse.data.slice(0, 3)); // Mostrar apenas 3 matches
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <DashboardHeader elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Olá, {user?.nome}!
        </Typography>
        <Typography variant="body1">
          {user?.objetivo_nutricional 
            ? `Seu objetivo nutricional: ${user.objetivo_nutricional}` 
            : 'Defina seu objetivo nutricional para recomendações personalizadas'}
        </Typography>
      </DashboardHeader>

      <Grid container spacing={4}>
        {/* Resumo Nutricional */}
        <Grid item xs={12} md={6}>
          <StatsCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Resumo Nutricional
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Acompanhe seu progresso e objetivos nutricionais.
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                Calorias diárias recomendadas: 2000 kcal
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', my: 2, width: '100%' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', margin: 1 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={75} 
                    size={100} 
                    thickness={4} 
                    sx={{ color: '#4CAF50' }} 
                  />
                  <Box sx={{ 
                    top: 0, 
                    left: 0, 
                    bottom: 0, 
                    right: 0, 
                    position: 'absolute', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexDirection: 'column' 
                  }}>
                    <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>Carb</Typography>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '1rem' }}>75%</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative', display: 'inline-flex', margin: 1 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={60} 
                    size={100} 
                    thickness={4} 
                    sx={{ color: '#8D6E63' }} 
                  />
                  <Box sx={{ 
                    top: 0, 
                    left: 0, 
                    bottom: 0, 
                    right: 0, 
                    position: 'absolute', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexDirection: 'column' 
                  }}>
                    <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>Proteína</Typography>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '1rem' }}>60%</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative', display: 'inline-flex', margin: 1 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={40} 
                    size={100} 
                    thickness={4} 
                    sx={{ color: '#8BC34A' }} 
                  />
                  <Box sx={{ 
                    top: 0, 
                    left: 0, 
                    bottom: 0, 
                    right: 0, 
                    position: 'absolute', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexDirection: 'column' 
                  }}>
                    <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>Fibra</Typography>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '1rem' }}>40%</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative', display: 'inline-flex', margin: 1 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={30} 
                    size={100} 
                    thickness={4} 
                    sx={{ color: '#F06292' }} 
                  />
                  <Box sx={{ 
                    top: 0, 
                    left: 0, 
                    bottom: 0, 
                    right: 0, 
                    position: 'absolute', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexDirection: 'column' 
                  }}>
                    <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>Gordura</Typography>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '1rem' }}>30%</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => router.push('/resumo-nutricional')}>Ver Detalhes</Button>
            </CardActions>
          </StatsCard>
        </Grid>

        {/* Receitas Recentes */}
        <Grid item xs={12} md={6}>
          <StatsCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Receitas Recentes
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Suas últimas receitas visualizadas.
              </Typography>
              
              {loadingData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : receitasRecentes.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {receitasRecentes.map((receita) => (
                    <Box key={receita.id} sx={{ mb: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {receita.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {receita.tempo_preparo} min | {receita.calorias_totais} kcal
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma receita visualizada recentemente.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => router.push('/receitas')}>Ver Todas</Button>
            </CardActions>
          </StatsCard>
        </Grid>

        {/* Matches Recomendados */}
        <Grid item xs={12}>
          <StatsCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Matches Recomendados
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Combinações perfeitas de alimentos e bebidas para você.
              </Typography>
              
              {loadingData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : matchesRecomendados.length > 0 ? (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {matchesRecomendados.map((match) => (
                    <Grid item xs={12} sm={4} key={match.id}>
                      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" fontWeight="bold" gutterBottom>
                            {match.alimento.nome} + {match.bebida.nome}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Score nutricional: {match.score_nutricional}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary" onClick={() => router.push(`/matches/${match.id}`)}>Detalhes</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum match recomendado disponível.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => router.push('/matches')}>Ver Todos</Button>
            </CardActions>
          </StatsCard>
        </Grid>
      </Grid>
    </Container>
  );
}