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
  TextField,
  Divider,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from 'styled-components';

// Importação para os gráficos
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const MedidasPaper = styled(Paper)`
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medidas-tabpanel-${index}`}
      aria-labelledby={`medidas-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

type MedidaType = {
  id: number;
  data_registro: string;
  peso: number;
  altura: number;
  cintura?: number;
  quadril?: number;
  braco?: number;
  percentual_gordura?: number;
  imc: number;
  classificacao_imc: string;
};

export default function MedidasPessoais() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [medidas, setMedidas] = useState<MedidaType[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Estados para nova medida
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [cintura, setCintura] = useState('');
  const [quadril, setQuadril] = useState('');
  const [braco, setBraco] = useState('');
  const [percentualGordura, setPercentualGordura] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  // Estado para controlar as abas
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      fetchMedidas();
    }
  }, [isAuthenticated, loading, router]);

  const fetchMedidas = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({
          type: 'error',
          text: 'Usuário não autenticado. Faça login novamente.'
        });
        router.push('/auth/login');
        return;
      }
      
      // Configurar axios para usar URL relativa
      const headers = { Authorization: `Bearer ${token}` };

      console.log('Buscando medidas do usuário...');
      const response = await axios.get('/api/users/medidas/', { 
        headers,
        timeout: 10000
      });
      
      console.log('Medidas recebidas:', response.data);
      setMedidas(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar medidas:', error);
      
      let errorMessage = 'Não foi possível carregar suas medidas. ';
      
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
        
        if (error.response.status === 401) {
          errorMessage += 'Usuário não autenticado. Faça login novamente.';
          setTimeout(() => router.push('/auth/login'), 2000);
        }
      } else if (error.request) {
        console.error('Sem resposta do servidor:', error.request);
        errorMessage += 'Sem resposta do servidor. Verifique sua conexão.';
      } else {
        errorMessage += error.message || 'Erro desconhecido.';
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Validação básica
    if (!peso || !altura) {
      setMessage({
        type: 'error',
        text: 'Peso e altura são obrigatórios.'
      });
      return;
    }
    
    setLoadingSubmit(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({
          type: 'error',
          text: 'Usuário não autenticado. Faça login novamente.'
        });
        router.push('/auth/login');
        return;
      }
      
      // Preparar dados para envio
      const medidaData: any = {
        peso: parseFloat(peso),
        altura: parseFloat(altura)
      };
      
      // Adicionar campos opcionais apenas se tiverem valor válido
      if (cintura && !isNaN(parseFloat(cintura))) medidaData.cintura = parseFloat(cintura);
      if (quadril && !isNaN(parseFloat(quadril))) medidaData.quadril = parseFloat(quadril);
      if (braco && !isNaN(parseFloat(braco))) {
        // No backend, temos braco_direito e braco_esquerdo
        medidaData.braco_direito = parseFloat(braco);
        medidaData.braco_esquerdo = parseFloat(braco);
      }
      if (percentualGordura && !isNaN(parseFloat(percentualGordura))) {
        medidaData.percentual_gordura = parseFloat(percentualGordura);
      }
      
      console.log('Enviando dados para API:', medidaData);
      
      // Configurar cabeçalhos com o token de autenticação
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Usar URL relativa para o endpoint da API
      const response = await axios.post('/api/users/medidas/', medidaData, { headers });
      
      console.log('Resposta da API:', response.data);
      
      // Limpar campos
      setPeso('');
      setAltura('');
      setCintura('');
      setQuadril('');
      setBraco('');
      setPercentualGordura('');
      
      setMessage({
        type: 'success',
        text: 'Medida registrada com sucesso!'
      });
      
      // Recarregar medidas
      fetchMedidas();
    } catch (error: any) {
      console.error('Erro ao registrar medida:', error);
      
      // Melhorar mensagem de erro com detalhes da resposta da API
      let errorMessage = 'Erro ao registrar medida. ';
      
      if (error.response) {
        // O servidor respondeu com um status de erro
        console.error('Detalhes do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
        
        if (error.response.status === 401) {
          errorMessage += 'Usuário não autenticado. Faça login novamente.';
          // Redirecionar para login se não estiver autenticado
          setTimeout(() => router.push('/auth/login'), 2000);
        } else if (error.response.data && typeof error.response.data === 'object') {
          // Extrair mensagens de erro do objeto de resposta
          const errorDetails = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
          errorMessage += errorDetails || 'Verifique os dados e tente novamente.';
        } else {
          errorMessage += 'Verifique os dados e tente novamente.';
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Sem resposta do servidor:', error.request);
        errorMessage += 'Sem resposta do servidor. Verifique sua conexão.';
      } else {
        // Erro na configuração da requisição
        errorMessage += error.message || 'Erro desconhecido.';
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteMedida = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta medida?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`/api/users/medidas/${id}/`, { headers });
      
      setMessage({
        type: 'success',
        text: 'Medida excluída com sucesso!'
      });
      
      // Atualizar lista de medidas
      fetchMedidas();
    } catch (error) {
      console.error('Erro ao excluir medida:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao excluir medida. Tente novamente.'
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Preparar dados para os gráficos
  const prepareChartData = () => {
    return medidas.map(medida => ({
      data: formatDate(medida.data_registro),
      peso: medida.peso,
      imc: medida.imc,
      cintura: medida.cintura,
      quadril: medida.quadril,
      braco: medida.braco,
      percentual_gordura: medida.percentual_gordura
    })).reverse(); // Mostrar dados mais recentes à direita
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ mb: 3 }}
        >
          Voltar para Dashboard
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Medidas Pessoais
        </Typography>
        
        {message.text && (
          <Alert severity={message.type as 'success' | 'error'} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MedidasPaper elevation={3}>
            <SectionTitle>Registrar Nova Medida</SectionTitle>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="peso"
                label="Peso"
                name="peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="altura"
                label="Altura"
                name="altura"
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
                helperText="Ex: 175 para 1,75m"
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="cintura"
                label="Cintura"
                name="cintura"
                type="number"
                value={cintura}
                onChange={(e) => setCintura(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="quadril"
                label="Quadril"
                name="quadril"
                type="number"
                value={quadril}
                onChange={(e) => setQuadril(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="braco"
                label="Braço"
                name="braco"
                type="number"
                value={braco}
                onChange={(e) => setBraco(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="percentualGordura"
                label="Percentual de Gordura"
                name="percentualGordura"
                type="number"
                value={percentualGordura}
                onChange={(e) => setPercentualGordura(e.target.value)}
                disabled={loadingSubmit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loadingSubmit}
                startIcon={<AddIcon />}
              >
                {loadingSubmit ? <CircularProgress size={24} /> : 'Registrar Medida'}
              </Button>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
                Registre as medidas básicas agora e adicione mais detalhes depois na tela de edição.
              </Typography>
            </Box>
          </MedidasPaper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <MedidasPaper elevation={3}>
            <SectionTitle>Evolução das Medidas</SectionTitle>
            
            {loadingData ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : medidas.length > 0 ? (
              <Box>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="medidas tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Tabela" id="medidas-tab-0" />
                  <Tab label="Peso e IMC" id="medidas-tab-1" />
                  <Tab label="Medidas Corporais" id="medidas-tab-2" />
                </Tabs>
                
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Clique no ícone <EditIcon fontSize="small" sx={{ verticalAlign: 'middle' }} /> para adicionar ou editar medidas detalhadas.
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table aria-label="tabela de medidas">
                      <TableHead>
                        <TableRow>
                          <TableCell>Data</TableCell>
                          <TableCell>Peso (kg)</TableCell>
                          <TableCell>IMC</TableCell>
                          <TableCell>Classificação</TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medidas.map((medida) => (
                          <TableRow key={medida.id}>
                            <TableCell>{formatDate(medida.data_registro)}</TableCell>
                            <TableCell>{medida.peso}</TableCell>
                            <TableCell>{medida.imc}</TableCell>
                            <TableCell>{medida.classificacao_imc}</TableCell>
                            <TableCell>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => router.push(`/medidas-pessoais/editar/${medida.id}`)}
                                title="Editar medida"
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteMedida(medida.id)}
                                title="Excluir medida"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ height: 400, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareChartData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="peso" 
                          name="Peso (kg)" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="imc" 
                          name="IMC" 
                          stroke="#82ca9d" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ height: 400, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareChartData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="cintura" 
                          name="Cintura (cm)" 
                          stroke="#8884d8" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="quadril" 
                          name="Quadril (cm)" 
                          stroke="#82ca9d" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="braco" 
                          name="Braço (cm)" 
                          stroke="#ffc658" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="percentual_gordura" 
                          name="% Gordura" 
                          stroke="#ff8042" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </TabPanel>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Nenhuma medida registrada ainda.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registre sua primeira medida para começar a acompanhar sua evolução.
                </Typography>
              </Box>
            )}
          </MedidasPaper>
        </Grid>
      </Grid>
    </Container>
  );
}