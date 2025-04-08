import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';

interface AnalysisResultsProps {
  data: {
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
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const getRiskColor = (risk: string): 'error' | 'warning' | 'success' | 'primary' => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* File Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              File Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Name:</strong> {data.file_info.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Size:</strong> {(data.file_info.size / 1024).toFixed(2)} KB
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Type:</strong> {data.file_info.type}
                </Typography>
                <Typography variant="body1">
                  <strong>Hash:</strong> {data.file_info.hash}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Risk Level */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color={getRiskColor(data.risk_level)} />
              <Typography variant="h6">
                Risk Level: <Chip label={data.risk_level.toUpperCase()} color={getRiskColor(data.risk_level)} />
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* YARA Matches */}
        {data.yara_matches.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BugReportIcon color="error" />
                <Typography variant="h6">YARA Rule Matches</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rule Name</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Matched Strings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.yara_matches.map((match, index) => (
                      <TableRow key={index}>
                        <TableCell>{match.rule_name}</TableCell>
                        <TableCell>
                          {match.tags.map((tag, i) => (
                            <Chip key={i} label={tag} size="small" sx={{ mr: 1 }} />
                          ))}
                        </TableCell>
                        <TableCell>
                          {match.strings.map((str, i) => (
                            <Typography key={i} variant="body2" component="div">
                              {str}
                            </Typography>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {/* Suspicious Patterns */}
        {data.suspicious_patterns.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon color="warning" />
                <Typography variant="h6">Suspicious Patterns</Typography>
              </Box>
              <Grid container spacing={2}>
                {data.suspicious_patterns.map((pattern, index) => (
                  <Grid item xs={12} key={index}>
                    <Typography variant="body1" color="warning.main">
                      • {pattern}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Timestamp */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            Analysis performed at: {new Date(data.timestamp).toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalysisResults; 