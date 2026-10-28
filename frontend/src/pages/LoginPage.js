import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container } from '@mui/material';
import { toast } from 'react-toastify';

import LoginForm from '../components/auth/LoginForm';
import { login, clearAuthError } from '../redux/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from || (user?.role === 'admin' ? '/admin/dashboard' : '/');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, from, dispatch]);

  const handleLogin = async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      toast.success(`Welcome back, ${result.user?.name || 'User'}!`);
      const target = result.user?.role === 'admin' ? '/admin/dashboard' : from;
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        background: 'radial-gradient(circle at center, rgba(233, 69, 96, 0.08) 0%, transparent 70%)',
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </Container>
    </Box>
  );
};

export default LoginPage;
