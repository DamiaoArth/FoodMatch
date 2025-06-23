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
  Button,
  CircularProgress,
  TextField,
  Alert,
  InputAdornment,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import styled from 'styled-components';

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

const SubSectionTitle = styled(Typography).attrs({
  component: 'h3',
  variant: 'h6'
})`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #2E7D32;
  font-weight: 500;
`;

type MedidaType = {
  id: number;
  data_registro: string;
  peso: number;
  altura: number;
  cintura?: number;
  quadril?: number;
  braco_direito?: number;
  braco_esquerdo?: number;
  coxa_direita?: number;
  coxa_esquerda?: number;
  panturrilha_direita?: number;
  panturrilha_esquerda?: number;
  pescoco?: number;
  torax?: number;
  percentual_gordura?: number;
  imc: number;
  classificacao_imc: string;
};

export default function EditarMedida() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [medida, setMedida] = useState<MedidaType | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Estados para os campos do formulário
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [cintura, setCintura] = useState('');
  const [quadril, setQuadril] = useState('');
  const [bracoDireito, setBracoDireito] = useState('');
  const [bracoEsquerdo, setBracoEsquerdo] = useState('');
  const [coxaDireita, setCoxaDireita] = useState('');
  const [coxaEsquerda, setCoxaEsquerda] = useState('');
  const [panturrilhaDireita, setPanturrilhaDireita] = useState('');
  const [panturrilhaEsquerda, setPanturrilhaEsquerda] = useState('');
  const [pescoco, setPescoco] = useState('');
  const [torax, setTorax] = useState('');
  const [percentualGordura, setPercentualGordura] = useState('');
  
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated && id) {
      fetchMedida();
    }
  }, [isAuthenticated, loading, router, id]);

  const fetchMedida = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`/api/users/medidas/${id}/`, { headers });
      const medidaData = response.data;
      setMedida(medidaData);
      
      // Preencher os campos do formulário
      setPeso(medidaData.peso?.toString() || '');
      setAltura(medidaData.altura?.toString() || '');
      setCintura(medidaData.cintura?.toString() || '');
      setQuadril(medidaData.quadril?.toString() || '');
      setBracoDireito(medidaData.braco_direito?.toString() || '');
      setBracoEsquerdo(medidaData.braco_esquerdo?.toString() || '');
      setCoxaDireita(medidaData.coxa_direita?.toString() || '');
      setCoxaEsquerda(medidaData.coxa_esquerda?.toString() || '');
      setPanturrilhaDireita(medidaData.panturrilha_direita?.toString() || '');
      setPanturrilhaEsquerda(medidaData.panturrilha_esquerda?.toString() || '');
      setPescoco(medidaData.pescoco?.toString() || '');
      setTorax(medidaData.torax?.toString() || '');
      setPercentualGordura(medidaData.percentual_gordura?.toString() || '');
      
    } catch (error) {
      console.error('Erro ao buscar medida:', error);
      setMessage({
        type: 'error',
        text: 'Não foi possível carregar os dados da medida. Tente novamente mais tarde.'
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
      
      // Configurar cabeçalhos com o token de autenticação
      const headers = { Authorization: `Bearer ${token}` };
      
      // Preparar dados para envio, permitindo valores vazios
      const medidaData: any = {
        peso: parseFloat(peso),
        altura: parseFloat(altura)
      };
      
      // Adicionar campos opcionais apenas se tiverem valor
      if (cintura) medidaData.cintura = parseFloat(cintura);
      if (quadril) medidaData.quadril = parseFloat(quadril);
      if (bracoDireito) medidaData.braco_direito = parseFloat(bracoDireito);
      if (bracoEsquerdo) medidaData.braco_esquerdo = parseFloat(bracoEsquerdo);
      if (coxaDireita) medidaData.coxa_direita = parseFloat(coxaDireita);
      if (coxaEsquerda) medidaData.coxa_esquerda = parseFloat(coxaEsquerda);
      if (panturrilhaDireita) medidaData.panturrilha_direita = parseFloat(panturrilhaDireita);
      if (panturrilhaEsquerda) medidaData.panturrilha_esquerda = parseFloat(panturrilhaEsquerda);
      if (pescoco) medidaData.pescoco = parseFloat(pescoco);
      if (torax) medidaData.torax = parseFloat(torax);
      if (percentualGordura) medidaData.percentual_gordura = parseFloat(percentualGordura);
      
      console.log('Enviando dados para API:', medidaData);
      
      // Garantir que o axios está configurado corretamente
      axios.defaults.baseURL = 'http://localhost:8000';
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      
      const response = await axios.put(`/api/users/medidas/${id}/`, medidaData, { 
        headers,
        // Adicionar timeout para evitar que a requisição fique pendente indefinidamente
        timeout: 10000
      });
      
      console.log('Resposta da API:', response.data);
      
      setMessage({
        type: 'success',
        text: 'Medida atualizada com sucesso!'
      });
      
      // Atualizar dados
      fetchMedida();
    } catch (error: any) {
      console.error('Erro ao atualizar medida:', error);
      
      // Melhorar mensagem de erro com detalhes da resposta da API
      let errorMessage = 'Erro ao atualizar medida. ';
      
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
        text: 'Erro ao atualizar medida. Verifique os dados e tente novamente.'
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading || loadingData) {
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
          onClick={() => router.push('/medidas-pessoais')}
          sx={{ mb: 3 }}
        >
          Voltar para Medidas
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Medida {medida && `(${formatDate(medida.data_registro)})`}
        </Typography>
        
        {message.text && (
          <Alert severity={message.type as 'success' | 'error'} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MedidasPaper elevation={3}>
            <SectionTitle>Editar Medida Corporal</SectionTitle>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* Medidas básicas */}
                <Grid item xs={12}>
                  <SubSectionTitle>Medidas Básicas</SubSectionTitle>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
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
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
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
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
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
                </Grid>
                
                {/* Medidas de tronco */}
                <Grid item xs={12}>
                  <SubSectionTitle>Medidas de Tronco</SubSectionTitle>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
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
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
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
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="pescoco"
                    label="Pescoço"
                    name="pescoco"
                    type="number"
                    value={pescoco}
                    onChange={(e) => setPescoco(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="torax"
                    label="Tórax"
                    name="torax"
                    type="number"
                    value={torax}
                    onChange={(e) => setTorax(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                {/* Medidas de membros superiores */}
                <Grid item xs={12}>
                  <SubSectionTitle>Medidas de Braços</SubSectionTitle>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="bracoDireito"
                    label="Braço Direito"
                    name="bracoDireito"
                    type="number"
                    value={bracoDireito}
                    onChange={(e) => setBracoDireito(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="bracoEsquerdo"
                    label="Braço Esquerdo"
                    name="bracoEsquerdo"
                    type="number"
                    value={bracoEsquerdo}
                    onChange={(e) => setBracoEsquerdo(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                {/* Medidas de membros inferiores */}
                <Grid item xs={12}>
                  <SubSectionTitle>Medidas de Pernas</SubSectionTitle>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="coxaDireita"
                    label="Coxa Direita"
                    name="coxaDireita"
                    type="number"
                    value={coxaDireita}
                    onChange={(e) => setCoxaDireita(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="coxaEsquerda"
                    label="Coxa Esquerda"
                    name="coxaEsquerda"
                    type="number"
                    value={coxaEsquerda}
                    onChange={(e) => setCoxaEsquerda(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="panturrilhaDireita"
                    label="Panturrilha Direita"
                    name="panturrilhaDireita"
                    type="number"
                    value={panturrilhaDireita}
                    onChange={(e) => setPanturrilhaDireita(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="panturrilhaEsquerda"
                    label="Panturrilha Esquerda"
                    name="panturrilhaEsquerda"
                    type="number"
                    value={panturrilhaEsquerda}
                    onChange={(e) => setPanturrilhaEsquerda(e.target.value)}
                    disabled={loadingSubmit}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    disabled={loadingSubmit}
                    startIcon={loadingSubmit ? <CircularProgress size={24} /> : <SaveIcon />}
                  >
                    {loadingSubmit ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => router.push('/medidas-pessoais')}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {medida && (
              <Box sx={{ mt: 4 }}>
                <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Informações Calculadas
                    </Typography>
                    <Typography variant="body1">
                      IMC: <strong>{medida.imc}</strong> ({medida.classificacao_imc})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Data de registro: {formatDate(medida.data_registro)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </MedidasPaper>
        </Grid>
      </Grid>
    </Container>
  );
}