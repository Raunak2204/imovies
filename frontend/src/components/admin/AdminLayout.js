import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ title, subtitle, action, children }) => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Admin Page Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h4" fontWeight={800} color="#fff">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </div>
        {action && <Box>{action}</Box>}
      </Box>

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3} lg={2.5}>
          <AdminSidebar />
        </Grid>

        {/* Content Area */}
        <Grid item xs={12} md={9} lg={9.5}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminLayout;
