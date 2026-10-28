import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatsCard = ({ title, value, icon, subtitle, trend, color = '#e94560' }) => {
  return (
    <Card
      elevation={2}
      sx={{
        backgroundColor: '#16213e',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          bgcolor: color,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="#fff" my={0.5}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: '#4caf50' }}>
                <TrendingUpIcon fontSize="small" />
                <Typography variant="caption" fontWeight={600}>
                  {trend} vs last month
                </Typography>
              </Box>
            )}
          </div>

          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
