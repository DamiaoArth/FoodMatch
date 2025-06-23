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
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Tooltip
} from '@mui/material';
import styled from 'styled-components';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';

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

type RefeicaoType = {
  id: number;
  tipo: string;
  tipo_display: string;
  horario: string;
  horario_formatado: string;
  descricao: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  receita?: number;
  receita_details?: ReceitaType;
};

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [receitasRecentes, setReceitasRecentes] = useState<ReceitaType[]>([]);
  const [matchesRecomendados, setMatchesRecomendados] = useState<MatchType[]>([]);
  const [refeicaoAtual, setRefeicaoAtual] = useState<RefeicaoType | null>(null);
  const [refeicoesDoDia, setRefeicoesDoDia] = useState<RefeicaoType[]>([]);
  const [mostrarTodasRefeicoes, setMostrarTodasRefeicoes] = useState(false);
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
      
      // Buscar refeição atual
      try {
        const refeicaoAtualResponse = await axios.get('/api/users/dietas/refeicao_atual/', { headers });
        setRefeicaoAtual(refeicaoAtualResponse.data);
      } catch (refeicaoError) {
        console.error('Erro ao buscar refeição atual:', refeicaoError);
        // Não interrompe o carregamento se não encontrar a refeição atual
      }
      
      // Buscar todas as refeições do dia
      try {
        const refeicoesDoDiaResponse = await axios.get('/api/users/dietas/refeicoes_do_dia/', { headers });
        setRefeicoesDoDia(refeicoesDoDiaResponse.data);
      } catch (refeicoesError) {
        console.error('Erro ao buscar refeições do dia:', refeicoesError);
        // Não interrompe o carregamento se não encontrar as refeições do dia
      }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Olá, {user?.nome}!
            </Typography>
            <Typography variant="body1">
              {user?.objetivo_nutricional 
                ? `Seu objetivo nutricional: ${user.objetivo_nutricional}` 
                : 'Defina seu objetivo nutricional para recomendações personalizadas'}
            </Typography>
          </Box>
          <Tooltip title="Acompanhe suas medidas corporais">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MonitorWeightIcon />}
              onClick={() => router.push('/medidas-pessoais')}
              sx={{ mt: 1 }}
            >
              Medidas Pessoais
            </Button>
          </Tooltip>
        </Box>
      </DashboardHeader>

      <Grid container spacing={4}>
        {/* Dieta do Usuário */}
        <Grid item xs={12}>
          <StatsCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                <RestaurantIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Sua Dieta
              </Typography>
              
              {loadingData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : refeicaoAtual ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Refeição atual: {refeicaoAtual.tipo_display} - {refeicaoAtual.horario_formatado}
                    </Typography>
                  </Box>
                  
                  <Card variant="outlined" sx={{ mb: 2, bgcolor: '#f9f9f9' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {refeicaoAtual.tipo_display}
                      </Typography>
                      
                      <Typography variant="body1" paragraph>
                        {refeicaoAtual.descricao}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Calorias</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {refeicaoAtual.calorias || 0} kcal
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Proteínas</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {refeicaoAtual.proteinas || 0}g
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Carboidratos</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {refeicaoAtual.carboidratos || 0}g
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Gorduras</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {refeicaoAtual.gorduras || 0}g
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {refeicaoAtual.receita_details && (
                        <Box sx={{ mt: 2 }}>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Receita recomendada:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {refeicaoAtual.receita_details.nome}
                          </Typography>
                          <Typography variant="body2">
                            Tempo de preparo: {refeicaoAtual.receita_details.tempo_preparo} min
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="text" 
                      color="primary" 
                      onClick={() => setMostrarTodasRefeicoes(!mostrarTodasRefeicoes)}
                      endIcon={mostrarTodasRefeicoes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                      {mostrarTodasRefeicoes ? 'Ocultar refeições' : 'Ver todas as refeições do dia'}
                    </Button>
                    
                    <Collapse in={mostrarTodasRefeicoes}>
                      <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 1 }}>
                        {refeicoesDoDia.map((refeicao) => (
                          <ListItem 
                            key={refeicao.id} 
                            alignItems="flex-start"
                            sx={{ 
                              borderLeft: refeicao.id === refeicaoAtual.id ? '4px solid #4CAF50' : 'none',
                              bgcolor: refeicao.id === refeicaoAtual.id ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                              mb: 1,
                              borderRadius: 1
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body1" fontWeight="bold">
                                    {refeicao.tipo_display}
                                  </Typography>
                                  <Chip 
                                    label={refeicao.horario_formatado} 
                                    size="small" 
                                    color={refeicao.id === refeicaoAtual.id ? "primary" : "default"}
                                    variant={refeicao.id === refeicaoAtual.id ? "filled" : "outlined"}
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    {refeicao.descricao}
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {refeicao.calorias || 0} kcal
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      P: {refeicao.proteinas || 0}g
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      C: {refeicao.carboidratos || 0}g
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      G: {refeicao.gorduras || 0}g
                                    </Typography>
                                  </Box>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Nenhuma dieta ativa encontrada.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => router.push('/perfil')}
                  >
                    Criar Dieta
                  </Button>
                </Box>
              )}
            </CardContent>
          </StatsCard>
        </Grid>
        
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