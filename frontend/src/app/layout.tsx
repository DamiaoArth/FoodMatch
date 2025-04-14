'use client';

import { Poppins, Inter } from 'next/font/google';
import Head from './head';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap'
});

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap'
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    secondary: {
      main: '#8BC34A',
      light: '#9CCC65',
      dark: '#689F38',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
});

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            color: '#ffffff',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }} 
          onClick={() => router.push('/')}
        >
          FoodMatch
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/dashboard');
                }}
                sx={{ 
                  mx: 0.5, 
                  px: 2,
                  color: '#ffffff',
                  fontWeight: 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 8,
                    left: 12,
                    right: 12,
                    height: 2,
                    bgcolor: '#ffffff',
                    borderRadius: 1,
                    opacity: pathname === '/dashboard' ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                onClick={() => router.push('/receitas')}
                sx={{ 
                  mx: 0.5, 
                  px: 2,
                  color: '#ffffff',
                  fontWeight: 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 8,
                    left: 12,
                    right: 12,
                    height: 2,
                    bgcolor: '#ffffff',
                    borderRadius: 1,
                    opacity: pathname === '/receitas' ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                }}
              >
                Receitas
              </Button>
              <Button 
                color="inherit" 
                onClick={() => router.push('/matches')}
                sx={{ 
                  mx: 0.5, 
                  px: 2,
                  color: '#ffffff',
                  fontWeight: 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 8,
                    left: 12,
                    right: 12,
                    height: 2,
                    bgcolor: '#ffffff',
                    borderRadius: 1,
                    opacity: pathname === '/matches' ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                }}
              >
                Matches
              </Button>
              <Button 
                color="inherit" 
                onClick={() => router.push('/perfil')}
                sx={{ 
                  mx: 0.5, 
                  px: 2,
                  color: '#ffffff',
                  fontWeight: 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 8,
                    left: 12,
                    right: 12,
                    height: 2,
                    bgcolor: '#ffffff',
                    borderRadius: 1,
                    opacity: pathname === '/perfil' ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                }}
              >
                Perfil
              </Button>
              <Button 
                variant="outlined"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                sx={{ 
                  ml: 2,
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="text"
                onClick={() => router.push('/auth/login')}
                sx={{ 
                  mx: 1, 
                  color: '#ffffff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="outlined"
                onClick={() => router.push('/auth/register')}
                sx={{ 
                  ml: 1,
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Cadastrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Head />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavBar />
              <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                {children}
              </Box>
              <Box 
                component="footer" 
                sx={{ 
                  py: 4, 
                  mt: 6,
                  bgcolor: 'background.paper', 
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)'
                }}
              >
                <Container maxWidth="lg">
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: { xs: 2, md: 0 }
                      }}
                    >
                      FoodMatch
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {/* Links do footer removidos conforme solicitado */}
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 400,
                        letterSpacing: '0.2px'
                      }}
                    >
                      © {new Date().getFullYear()} FoodMatch - Seu Assistente Inteligente de Alimentação
                    </Typography>
                  </Box>
                </Container>
              </Box>
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}