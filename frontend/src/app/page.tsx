'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  CardMedia
} from '@mui/material';
import styled from 'styled-components';

const HeroSection = styled(Box)`
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  padding: 5rem 0;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FeatureCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.5px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            FoodMatch
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 500, 
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: 3,
              opacity: 0.9
            }}
          >
            Seu Assistente Inteligente de Alimentação
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              mb: 5, 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              opacity: 0.85
            }}
          >
            Combine alimentos e bebidas com base em seus objetivos nutricionais e preferências.
            Calcule informações nutricionais, descubra receitas e gere listas de compras inteligentes.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={(e) => {
                e.preventDefault();
                router.push('/auth/register');
              }}
              sx={{ 
                mx: 1, 
                px: 4, 
                py: 1.5, 
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(139, 195, 74, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(139, 195, 74, 0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Começar Agora
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              onClick={(e) => {
                e.preventDefault();
                router.push('/auth/login');
              }}
              sx={{ 
                mx: 1, 
                px: 4, 
                py: 1.5, 
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Entrar
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Principais Funcionalidades
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          Descubra como o FoodMatch pode transformar sua experiência alimentar e ajudar você a atingir seus objetivos nutricionais.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem'
                }}
              >
                🍽️
              </CardMedia>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Match de Alimentos e Bebidas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Encontre as combinações perfeitas de alimentos e bebidas com base em seus objetivos nutricionais e preferências de sabor.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: '#8BC34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem'
                }}
              >
                📊
              </CardMedia>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Informações Nutricionais
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe calorias, proteínas, carboidratos e gorduras de suas refeições para manter uma dieta equilibrada e saudável.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: '#CDDC39',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem'
                }}
              >
                📝
              </CardMedia>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Receitas Personalizadas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Descubra receitas que se alinham com seus objetivos nutricionais e preferências, com instruções detalhadas de preparo.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={(e) => {
              e.preventDefault();
              router.push('/auth/register');
            }}
            sx={{ px: 4, py: 1.5 }}
          >
            Experimente Gratuitamente
          </Button>
        </Box>
      </Container>

      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Como Funciona
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            Em apenas três passos simples, você pode começar a usar o FoodMatch para melhorar sua alimentação.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>1</Typography>
                <Typography variant="h6" gutterBottom>Crie sua conta</Typography>
                <Typography variant="body2" color="text.secondary">
                  Registre-se gratuitamente e defina seus objetivos nutricionais e preferências alimentares.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>2</Typography>
                <Typography variant="h6" gutterBottom>Explore combinações</Typography>
                <Typography variant="body2" color="text.secondary">
                  Descubra matches perfeitos entre alimentos e bebidas que atendam às suas necessidades nutricionais.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>3</Typography>
                <Typography variant="h6" gutterBottom>Acompanhe seu progresso</Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitore sua alimentação e veja como suas escolhas estão alinhadas com seus objetivos.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}