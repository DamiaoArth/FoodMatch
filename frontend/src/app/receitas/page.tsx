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
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import styled from 'styled-components';

const ReceitaCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

// Definindo altura fixa para os cards
const cardHeight = '400px';

const ReceitaMedia = styled(CardMedia)`
  height: 180px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 3rem;
`;

const ReceitaContent = styled(CardContent)`
  flex-grow: 1;
`;

type ReceitaType = {
  id: number;
  nome: string;
  ingredientes: string;
  tempo_preparo: number;
  calorias_totais: number;
  imagem?: string;
};

export default function Receitas() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [receitas, setReceitas] = useState<ReceitaType[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [caloriasFiltro, setCaloriasFiltro] = useState('');
  const [tempoFiltro, setTempoFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      fetchReceitas();
    }
  }, [isAuthenticated, loading, router, page, caloriasFiltro, tempoFiltro]);
  
  const fetchReceitas = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Construir parâmetros de consulta
      let params: any = { page };
      
      if (caloriasFiltro) {
        params.calorias = caloriasFiltro;
      }
      
      if (tempoFiltro) {
        params.tempo = tempoFiltro;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get('/api/recipes/receitas/', { 
        headers,
        params
      });
      
      setReceitas(response.data.results || response.data);
      
      // Configurar paginação se disponível na resposta
      if (response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 10)); // Assumindo 10 itens por página
      }
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetar para a primeira página ao pesquisar
    fetchReceitas();
  };
  
  const handleCaloriasChange = (event: SelectChangeEvent) => {
    setCaloriasFiltro(event.target.value);
    setPage(1);
  };
  
  const handleTempoChange = (event: SelectChangeEvent) => {
    setTempoFiltro(event.target.value);
    setPage(1);
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Receitas
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => router.push('/receitas/cadastrar')}
        >
          Cadastrar Nova Receita
        </Button>
      </Box>
      
      {/* Barra de pesquisa e filtros */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="calorias-label">Calorias</InputLabel>
                <Select
                  labelId="calorias-label"
                  value={caloriasFiltro}
                  label="Calorias"
                  onChange={handleCaloriasChange}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="ate-300">Até 300 kcal</MenuItem>
                  <MenuItem value="300-500">300-500 kcal</MenuItem>
                  <MenuItem value="500-800">500-800 kcal</MenuItem>
                  <MenuItem value="acima-800">Acima de 800 kcal</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel id="tempo-label">Tempo de Preparo</InputLabel>
                <Select
                  labelId="tempo-label"
                  value={tempoFiltro}
                  label="Tempo de Preparo"
                  onChange={handleTempoChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="ate-15">Até 15 min</MenuItem>
                  <MenuItem value="15-30">15-30 min</MenuItem>
                  <MenuItem value="30-60">30-60 min</MenuItem>
                  <MenuItem value="acima-60">Mais de 60 min</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Lista de receitas */}
      {loadingData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : receitas.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {receitas.map((receita) => (
              <Grid item xs={12} sm={6} md={4} key={receita.id}>
                <ReceitaCard sx={{ height: cardHeight }}>
                  {receita.imagem ? (
                    <ReceitaMedia
                      image={receita.imagem}
                      title={receita.nome}
                    />
                  ) : (
                    <ReceitaMedia>
                      🍽️
                    </ReceitaMedia>
                  )}
                  <ReceitaContent sx={{ height: '150px', overflow: 'hidden' }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {receita.nome}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={`${receita.tempo_preparo} min`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={`${receita.calorias_totais} kcal`} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {receita.ingredientes}
                    </Typography>
                  </ReceitaContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => router.push(`/receitas/${receita.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </ReceitaCard>
              </Grid>
            ))}
          </Grid>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma receita encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar seus filtros ou buscar por outro termo
          </Typography>
        </Box>
      )}
    </Container>
  );
}