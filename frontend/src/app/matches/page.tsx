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
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';

const MatchCard = styled(Card)`
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

const MatchMedia = styled(CardMedia)`
  height: 180px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 3rem;
`;

const MatchContent = styled(CardContent)`
  flex-grow: 1;
`;

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
  descricao?: string;
};

export default function Matches() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      fetchMatches();
    }
  }, [isAuthenticated, loading, router, page]);
  
  const fetchMatches = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Buscar matches
      const response = await axios.get('/api/matches/', { 
        headers,
        params: { page }
      });
      
      setMatches(response.data.results || response.data);
      setTotalPages(Math.ceil((response.data.count || response.data.length) / 10));
    } catch (error) {
      console.error('Erro ao buscar matches:', error);
    } finally {
      setLoadingData(false);
    }
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredMatches = matches.filter(match => {
    const searchLower = searchTerm.toLowerCase();
    return (
      match.alimento.nome.toLowerCase().includes(searchLower) ||
      match.bebida.nome.toLowerCase().includes(searchLower)
    );
  });
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Matches de Alimentos e Bebidas
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar matches..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {loadingData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredMatches.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {filteredMatches.map((match) => (
              <Grid item xs={12} sm={6} md={4} key={match.id}>
                <MatchCard sx={{ height: cardHeight }}>
                  <MatchMedia>
                    🍽️ + 🥤
                  </MatchMedia>
                  <MatchContent sx={{ height: '150px', overflow: 'hidden' }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {match.alimento.nome} + {match.bebida.nome}
                    </Typography>
                    <Chip 
                      label={`Score: ${match.score_nutricional}`} 
                      color={match.score_nutricional > 7 ? "success" : match.score_nutricional > 5 ? "warning" : "error"}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    {match.descricao && (
                      <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {match.descricao}
                      </Typography>
                    )}
                  </MatchContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => router.push(`/matches/${match.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </MatchCard>
              </Grid>
            ))}
          </Grid>
          
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
            Nenhum match encontrado.
          </Typography>
        </Box>
      )}
    </Container>
  );
}