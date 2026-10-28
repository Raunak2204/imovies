import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatCurrency } from '../../utils/helpers';

const PaymentForm = ({
  amount,
  onPay,
  onRazorpayPay,
  loading = false,
  razorpayLoading = false,
}) => {
  const [method, setMethod] = useState('razorpay');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8910',
    cardHolder: 'Demo User',
    expiry: '12/28',
    cvv: '888',
  });
  const [upiId, setUpiId] = useState('moviegoer@upi');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (method === 'razorpay') {
      if (onRazorpayPay) {
        onRazorpayPay();
        return;
      }
    }

    if (method === 'credit_card' || method === 'debit_card') {
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiry || !cardDetails.cvv) {
        setError('Please fill out all card details');
        return;
      }
    } else if (method === 'upi') {
      if (!upiId) {
        setError('Please enter a valid UPI ID');
        return;
      }
    }

    onPay({
      method,
      amount,
      details: method === 'upi' ? { upiId } : cardDetails,
    });
  };

  return (
    <Paper
      elevation={3}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 2.5, sm: 4 },
        backgroundColor: '#16213e',
        borderRadius: 3.5,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#fff">
            Select Payment Method
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Choose how you would like to complete your ticket booking
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#4caf50', bgcolor: 'rgba(76, 175, 80, 0.1)', px: 1.5, py: 0.5, borderRadius: 2 }}>
          <SecurityIcon fontSize="small" />
          <Typography variant="caption" fontWeight={700}>
            256-Bit SSL Encrypted
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Payment Methods */}
      <RadioGroup
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        sx={{ mb: 3.5, display: 'flex', flexDirection: 'column', gap: 1.8 }}
      >
        {/* 1. RAZORPAY - RECOMMENDED */}
        <Paper
          variant="outlined"
          onClick={() => setMethod('razorpay')}
          sx={{
            p: 2.5,
            cursor: 'pointer',
            bgcolor: method === 'razorpay' ? 'rgba(51, 149, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            borderColor: method === 'razorpay' ? '#3395ff' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.25s ease',
            position: 'relative',
            '&:hover': {
              borderColor: '#3395ff',
              bgcolor: 'rgba(51, 149, 255, 0.05)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <FormControlLabel
              value="razorpay"
              control={<Radio sx={{ color: '#3395ff', '&.Mui-checked': { color: '#3395ff' } }} />}
              label={
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#fff">
                      Razorpay Gateway
                    </Typography>
                    <Chip
                      label="RECOMMENDED"
                      size="small"
                      sx={{
                        bgcolor: 'linear-gradient(45deg, #0c2340, #3395ff)',
                        backgroundColor: '#3395ff',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        height: 20,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.3}>
                    UPI (Google Pay, PhonePe, Paytm), All Cards, Net Banking & Wallets
                  </Typography>
                </Box>
              }
            />

            {/* Razorpay Brand Icon */}
            <Box
              sx={{
                bgcolor: '#0c2340',
                border: '1px solid #3395ff',
                px: 1.5,
                py: 0.6,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <FlashOnIcon sx={{ color: '#3395ff', fontSize: 18 }} />
              <Typography variant="caption" fontWeight={900} color="#3395ff" letterSpacing={1}>
                RAZORPAY
              </Typography>
            </Box>
          </Box>

          {/* Expanded Features when selected */}
          {method === 'razorpay' && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(51, 149, 255, 0.2)' }}>
              <Grid container spacing={1.5}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1.5, textAlign: 'center' }}>
                    <QrCodeIcon sx={{ color: '#4caf50', fontSize: 22 }} />
                    <Typography variant="caption" display="block" color="#fff" fontWeight={600}>Instant UPI</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1.5, textAlign: 'center' }}>
                    <CreditCardIcon sx={{ color: '#2196f3', fontSize: 22 }} />
                    <Typography variant="caption" display="block" color="#fff" fontWeight={600}>Visa / MC / RuPay</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1.5, textAlign: 'center' }}>
                    <AccountBalanceIcon sx={{ color: '#ff9800', fontSize: 22 }} />
                    <Typography variant="caption" display="block" color="#fff" fontWeight={600}>50+ Banks</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1.5, textAlign: 'center' }}>
                    <AccountBalanceWalletIcon sx={{ color: '#e94560', fontSize: 22 }} />
                    <Typography variant="caption" display="block" color="#fff" fontWeight={600}>Wallets</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* 2. Direct Credit/Debit Card Option */}
        <Paper
          variant="outlined"
          onClick={() => setMethod('credit_card')}
          sx={{
            p: 2,
            cursor: 'pointer',
            bgcolor: method === 'credit_card' ? 'rgba(233, 69, 96, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            borderColor: method === 'credit_card' ? '#e94560' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.25s ease',
          }}
        >
          <FormControlLabel
            value="credit_card"
            control={<Radio sx={{ color: '#e94560', '&.Mui-checked': { color: '#e94560' } }} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCardIcon sx={{ color: '#e94560' }} />
                <Typography variant="subtitle1" fontWeight={700} color="#fff">
                  Direct Card Payment
                </Typography>
              </Box>
            }
          />

          {method === 'credit_card' && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    size="small"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    size="small"
                    value={cardDetails.cardHolder}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Expiry (MM/YY)"
                    size="small"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="CVV"
                    size="small"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* 3. Direct UPI ID Option */}
        <Paper
          variant="outlined"
          onClick={() => setMethod('upi')}
          sx={{
            p: 2,
            cursor: 'pointer',
            bgcolor: method === 'upi' ? 'rgba(76, 175, 80, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            borderColor: method === 'upi' ? '#4caf50' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.25s ease',
          }}
        >
          <FormControlLabel
            value="upi"
            control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QrCodeIcon sx={{ color: '#4caf50' }} />
                <Typography variant="subtitle1" fontWeight={700} color="#fff">
                  Direct UPI ID (VPA)
                </Typography>
              </Box>
            }
          />

          {method === 'upi' && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <TextField
                fullWidth
                label="UPI Virtual Address (e.g. yourname@okhdfcbank)"
                size="small"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </Box>
          )}
        </Paper>
      </RadioGroup>

      {/* Pay CTA */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading || razorpayLoading}
        sx={{
          py: 1.5,
          fontWeight: 800,
          fontSize: '1.05rem',
          background:
            method === 'razorpay'
              ? 'linear-gradient(45deg, #0c2340 0%, #3395ff 100%)'
              : 'linear-gradient(45deg, #e94560, #ff6b81)',
          boxShadow: method === 'razorpay' ? '0 4px 20px rgba(51, 149, 255, 0.4)' : '0 4px 20px rgba(233, 69, 96, 0.4)',
        }}
      >
        {razorpayLoading || loading
          ? 'Launching Checkout...'
          : method === 'razorpay'
          ? `Pay ${formatCurrency(amount)} with Razorpay`
          : `Pay ${formatCurrency(amount)} Now`}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.8 }}>
        🔒 Secured by Razorpay & 256-bit Bank Grade Encryption
      </Typography>
    </Paper>
  );
};

export default PaymentForm;
