import React, { useState } from 'react';
import { Box, Paper, Typography, Button, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AnalysisResults from './AnalysisResults';

interface AnalysisData {
  file_info: {
    name: string;
    size: number;
    type: string;
    hash: string;
  };
  yara_matches: Array<{
    rule_name: string;
    strings: string[];
    tags: string[];
  }>;
  suspicious_patterns: string[];
  risk_level: string;
  timestamp: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setAnalysisData(null);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisData(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.analysis?.status === 'success') {
          setAnalysisData(result.analysis.data);
        } else {
          setError('Analysis failed: ' + (result.analysis?.message || 'Unknown error'));
        }
      } else {
        setError('Upload failed: ' + response.statusText);
      }
    } catch (error) {
      setError('Error uploading file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upload Ransomware Sample
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '2px dashed #ccc',
          cursor: 'pointer',
          mb: 3,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop a file here, or click to select
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: .exe, .dll, .zip
        </Typography>
      </Paper>

      {file && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            Selected file: {file.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading}
            sx={{ mt: 2 }}
          >
            {uploading ? 'Uploading...' : 'Upload and Analyze'}
          </Button>
          {uploading && (
            <LinearProgress sx={{ mt: 2 }} />
          )}
        </Box>
      )}

      {analysisData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Analysis Results
          </Typography>
          <AnalysisResults data={analysisData} />
        </Box>
      )}
    </Box>
  );
};

export default FileUpload; 