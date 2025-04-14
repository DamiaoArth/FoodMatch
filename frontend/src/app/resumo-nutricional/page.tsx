'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  LinearProgress,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';

const NutritionPaper = styled(Paper)`
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

const NutrientCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const NutrientChip = styled(Chip)`
  margin: 0.5rem;
  padding: 1rem 0.5rem;
  font-weight: 500;
`;

const CircularProgressBox = styled(Box)`
  position: relative;
  display: inline-flex;
  margin: 1rem;
  min-width: 120px;
  min-height: 120px;
`;

const CircularProgressLabel = styled(Box)`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 5px;
  text-align: center;
  width: 100%;
`;

export default function ResumoNutricional() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '800px', mb: 2 }}>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ mb: 3 }}
        >
          Voltar para Dashboard
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Resumo Nutricional
      </Typography>
      
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <NutritionPaper elevation={3}>
            <SectionTitle>Objetivos Nutricionais</SectionTitle>
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Objetivo atual: {user?.objetivo_nutricional || "Não definido"}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', my: 4, width: '100%', margin: '0 auto', textAlign: 'center', maxWidth: '100%' }}>
              <CircularProgressBox>
                <CircularProgress 
                  variant="determinate" 
                  value={75} 
                  size={120} 
                  thickness={4} 
                  sx={{ color: '#4CAF50' }} 
                />
                <CircularProgressLabel>
                  <Typography variant="subtitle2">Carb</Typography>
                  <Typography variant="h6" fontWeight="bold">75%</Typography>
                </CircularProgressLabel>
              </CircularProgressBox>
              
              <CircularProgressBox>
                <CircularProgress 
                  variant="determinate" 
                  value={60} 
                  size={120} 
                  thickness={4} 
                  sx={{ color: '#8D6E63' }} 
                />
                <CircularProgressLabel>
                  <Typography variant="subtitle2">Proteína</Typography>
                  <Typography variant="h6" fontWeight="bold">60%</Typography>
                </CircularProgressLabel>
              </CircularProgressBox>
              
              <CircularProgressBox>
                <CircularProgress 
                  variant="determinate" 
                  value={40} 
                  size={120} 
                  thickness={4} 
                  sx={{ color: '#8BC34A' }} 
                />
                <CircularProgressLabel>
                  <Typography variant="subtitle2">Fibra</Typography>
                  <Typography variant="h6" fontWeight="bold">40%</Typography>
                </CircularProgressLabel>
              </CircularProgressBox>
              
              <CircularProgressBox>
                <CircularProgress 
                  variant="determinate" 
                  value={30} 
                  size={120} 
                  thickness={4} 
                  sx={{ color: '#F06292' }} 
                />
                <CircularProgressLabel>
                  <Typography variant="subtitle2">Gordura</Typography>
                  <Typography variant="h6" fontWeight="bold">30%</Typography>
                </CircularProgressLabel>
              </CircularProgressBox>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <SectionTitle>Distribuição Calórica Diária</SectionTitle>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Calorias diárias recomendadas: 2000 kcal
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                />
                <Typography variant="caption" color="text.secondary">
                  1300 / 2000 kcal consumidas hoje
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" gutterBottom>
                  Proteínas: 25%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={80} 
                  sx={{ height: 10, borderRadius: 5, mb: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#8D6E63' } }} 
                />
                <Typography variant="caption" color="text.secondary">
                  80g / 100g
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" gutterBottom>
                  Carboidratos: 50%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={60} 
                  sx={{ height: 10, borderRadius: 5, mb: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#4CAF50' } }} 
                />
                <Typography variant="caption" color="text.secondary">
                  120g / 200g
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" gutterBottom>
                  Gorduras: 25%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={40} 
                  sx={{ height: 10, borderRadius: 5, mb: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#F06292' } }} 
                />
                <Typography variant="caption" color="text.secondary">
                  20g / 50g
                </Typography>
              </Grid>
            </Grid>
          </NutritionPaper>
          
          <NutritionPaper elevation={3}>
            <SectionTitle>Plano de Refeições</SectionTitle>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <NutrientCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Café da Manhã
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Horário recomendado: 7:00 - 8:30
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Recomendações:</strong>
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Proteínas e carboidratos complexos" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Frutas para vitaminas e minerais" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Evitar açúcares simples" />
                      </ListItem>
                    </List>
                  </CardContent>
                </NutrientCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <NutrientCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Almoço
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Horário recomendado: 12:00 - 13:30
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Recomendações:</strong>
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Proteínas magras (frango, peixe)" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Vegetais variados (metade do prato)" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Carboidratos complexos em porção moderada" />
                      </ListItem>
                    </List>
                  </CardContent>
                </NutrientCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <NutrientCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lanche da Tarde
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Horário recomendado: 15:30 - 16:30
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Recomendações:</strong>
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Frutas ou oleaginosas" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Iogurte natural ou proteína" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Evitar alimentos processados" />
                      </ListItem>
                    </List>
                  </CardContent>
                </NutrientCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <NutrientCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Jantar
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Horário recomendado: 19:00 - 20:30
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Recomendações:</strong>
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Refeição leve e com pouco carboidrato" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Priorizar proteínas e vegetais" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Evitar alimentos pesados antes de dormir" />
                      </ListItem>
                    </List>
                  </CardContent>
                </NutrientCard>
              </Grid>
            </Grid>
          </NutritionPaper>
        </Box>
    </Container>
  );
}