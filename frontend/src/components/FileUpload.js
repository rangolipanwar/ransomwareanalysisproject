import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Chip,
  Divider,
  Grid,
  IconButton,
  Fade,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  NetworkCheck as NetworkCheckIcon,
} from '@mui/icons-material';

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-msdownload': ['.exe'],
      'application/x-dosexec': ['.exe'],
      'application/x-executable': ['.exe', '.bin'],
      'application/x-msdos-program': ['.exe'],
      'application/octet-stream': ['.dll', '.exe', '.bin'],
      'application/x-binary': ['.bin'],
      'application/x-mach-binary': ['.bin'],
      'application/x-elf': ['.bin'],
      'application/x-sharedlib': ['.so', '.dylib'],
      'application/x-object': ['.o', '.obj'],
    },
    maxFiles: 1,
  });

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return '#ff1744';
      case 'medium':
        return '#ff9100';
      case 'low':
        return '#00e676';
      default:
        return '#757575';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card
        elevation={8}
        sx={{
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '3px dashed',
              borderColor: isDragActive ? 'primary.main' : 'rgba(144, 202, 249, 0.3)',
              borderRadius: 4,
              p: 6,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'rgba(144, 202, 249, 0.08)' : 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(144, 202, 249, 0.08)',
                transform: 'scale(1.02)',
              },
            }}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <CircularProgress size={60} />
            ) : (
              <Fade in={true}>
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
                    Drag & Drop Ransomware Sample
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    or click to select file
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Select File
                  </Button>
                </Box>
              </Fade>
            )}
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': { fontSize: '2rem' },
              }}
            >
              {error}
            </Alert>
          )}

          {analysis && (
            <Fade in={true}>
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40 }} />
                  Analysis Results
                </Typography>

                <Grid container spacing={3}>
                  {/* File Information Card */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'rgba(30, 30, 30, 0.9)',
                        height: '100%',
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: '#90caf9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CodeIcon />
                        File Information
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Type
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-word' }}>
                          {analysis.file_info?.type}
                        </Typography>

                        <Typography variant="subtitle1" color="textSecondary">
                          Size
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {(analysis.file_info?.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>

                        <Typography variant="subtitle1" color="textSecondary">
                          Hash (SHA-256)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            p: 1,
                            borderRadius: 1,
                            wordBreak: 'break-all',
                          }}
                        >
                          {analysis.file_info?.hash}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Risk Level and Patterns Card */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'rgba(30, 30, 30, 0.9)',
                        height: '100%',
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: '#90caf9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <WarningIcon />
                        Threat Assessment
                      </Typography>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                          Risk Level
                        </Typography>
                        <Chip
                          label={analysis.risk_level?.toUpperCase()}
                          sx={{
                            bgcolor: getRiskLevelColor(analysis.risk_level),
                            color: '#fff',
                            fontSize: '1.2rem',
                            py: 2,
                            px: 1,
                          }}
                        />
                      </Box>

                      <Box sx={{ mt: 4 }}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <BugReportIcon />
                          Suspicious Patterns
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {analysis.suspicious_patterns?.map((pattern, index) => (
                            <Chip
                              key={index}
                              label={pattern}
                              sx={{
                                m: 0.5,
                                bgcolor: 'rgba(255, 23, 68, 0.15)',
                                borderColor: 'error.main',
                                '&:hover': {
                                  bgcolor: 'rgba(255, 23, 68, 0.25)',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* YARA Matches Card */}
                  <Grid item xs={12}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'rgba(30, 30, 30, 0.9)',
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: '#90caf9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <NetworkCheckIcon />
                        YARA Rule Matches
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {analysis.yara_matches?.map((match, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                              sx={{
                                p: 2,
                                bgcolor: 'rgba(144, 202, 249, 0.05)',
                                border: '1px solid rgba(144, 202, 249, 0.2)',
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="subtitle1" color="primary">
                                {match.rule_name}
                              </Typography>
                              {match.strings && (
                                <Box sx={{ mt: 1 }}>
                                  {match.strings.map((str, idx) => (
                                    <Typography
                                      key={idx}
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{ fontSize: '0.8rem' }}
                                    >
                                      {str}
                                    </Typography>
                                  ))}
                                </Box>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FileUpload; 