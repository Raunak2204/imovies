import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container } from '@mui/material';
import { toast } from 'react-toastify';

import RegisterForm from '../components/auth/RegisterForm';
import { register, clearAuthError } from '../redux/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleRegister = async (userData) => {
    try {
      const result = await dispatch(register(userData)).unwrap();
      toast.success(`Account created! Welcome to IMovies, ${result.user?.name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err || 'Registration failed. Please try again.');
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
        background: 'radial-gradient(circle at center, rgba(15, 52, 96, 0.15) 0%, transparent 70%)',
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
      </Container>
    </Box>
  );
};

export default RegisterPage;
