import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Security as SecurityIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import FileUpload from './components/FileUpload';

// Create a custom dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#b3e5fc',
      dark: '#648dae',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#ff1744',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(30, 30, 30, 0.96)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(144, 202, 249, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
        }}
      >
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
            <SecurityIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 500,
                background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ransomware Analysis Framework
            </Typography>
            <IconButton
              color="inherit"
              href="https://github.com/rangolipanwar/ransomwareanalysisproject"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <FileUpload />
        </Container>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            textAlign: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Ransomware Analysis Framework. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 
