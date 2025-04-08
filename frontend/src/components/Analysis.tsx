import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';

interface AnalysisResult {
  encryption_method: string;
  network_activity: Array<{
    timestamp: string;
    type: string;
    details: string;
  }>;
  file_changes: Array<{
    path: string;
    type: string;
    timestamp: string;
  }>;
}

const Analysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analysis');
        if (response.ok) {
          const data = await response.json();
          setAnalysisData(data.data);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analysis Results
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Encryption Analysis
            </Typography>
            <Typography variant="body1">
              Method: {analysisData?.encryption_method || 'Unknown'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Network Activity
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analysisData?.network_activity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.timestamp}</TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              File Changes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Path</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analysisData?.file_changes.map((change, index) => (
                    <TableRow key={index}>
                      <TableCell>{change.path}</TableCell>
                      <TableCell>{change.type}</TableCell>
                      <TableCell>{change.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analysis; 