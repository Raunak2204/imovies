import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LocalMovies as LocalMoviesIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  InfoOutlined as InfoIcon,
  HelpOutline as HelpIcon,
  GavelOutlined as GavelIcon,
  SecurityOutlined as ShieldIcon,
  MonetizationOnOutlined as RefundIcon,
} from '@mui/icons-material';

const POLICY_SECTIONS = [
  { id: 'about', label: 'About Us', icon: <InfoIcon fontSize="small" /> },
  { id: 'faqs', label: 'FAQs', icon: <HelpIcon fontSize="small" /> },
  { id: 'terms', label: 'Terms & Conditions', icon: <GavelIcon fontSize="small" /> },
  { id: 'privacy', label: 'Privacy Policy', icon: <ShieldIcon fontSize="small" /> },
  { id: 'refund', label: 'Refund Policy', icon: <RefundIcon fontSize="small" /> },
];

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenPolicy = (index) => {
    setActiveTab(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box
      component="footer"
      className="no-print"
      sx={{
        bgcolor: '#0d1524',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalMoviesIcon sx={{ color: '#e94560', fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #e94560, #ff6b81)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                IMovies
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2, lineHeight: 1.8 }}>
              Your premier destination for cinema booking. Experience movies the way they were meant to be seen with cutting-edge IMAX, Dolby Atmos, and contactless QR admission.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, Twitter, Instagram, YouTube].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: '#b0b0b0',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { color: '#e94560', borderColor: '#e94560' },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: 16 }}>
              Quick Links
            </Typography>
            {[
              { label: 'Home', path: '/' },
              { label: 'Movies Catalog', path: '/movies' },
              { label: 'My Bookings', path: '/my-bookings' },
              { label: 'My Profile', path: '/profile' },
            ].map((link) => (
              <Typography
                key={link.path}
                component={Link}
                to={link.path}
                variant="body2"
                sx={{
                  display: 'block',
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  mb: 1.2,
                  '&:hover': { color: '#e94560' },
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Help & Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: 16 }}>
              Help & Information
            </Typography>
            {POLICY_SECTIONS.map((section, idx) => (
              <Typography
                key={section.id}
                variant="body2"
                onClick={() => handleOpenPolicy(idx)}
                sx={{
                  color: '#b0b0b0',
                  mb: 1.2,
                  cursor: 'pointer',
                  '&:hover': { color: '#e94560', transform: 'translateX(4px)' },
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.8,
                }}
              >
                {section.label}
              </Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: 16 }}>
              Contact Us
            </Typography>
            {[
              { icon: <LocationIcon fontSize="small" />, text: '123 Cinema Street, Bandra Kurla Complex, Mumbai 400051' },
              { icon: <PhoneIcon fontSize="small" />, text: '+91 98765 43210 (24x7 Helpline)' },
              { icon: <EmailIcon fontSize="small" />, text: 'support@imovies.com' },
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                <Box sx={{ color: '#e94560', mt: 0.3 }}>{item.icon}</Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            © {new Date().getFullYear()} IMovies Entertainment Pvt Ltd. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Built for Cinema Lovers • Powered by Next-Gen Multiplex Engine
          </Typography>
        </Box>
      </Container>

      {/* Information & Policies Modal Dialog */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#16213e',
            color: '#fff',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalMoviesIcon sx={{ color: '#e94560' }} />
            <Typography variant="h6" fontWeight={700}>
              IMovies Information & Policies
            </Typography>
          </Box>
          <IconButton onClick={handleCloseModal} sx={{ color: '#b0b0b0', '&:hover': { color: '#fff' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.08)', px: 2, bgcolor: '#0f172a' }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#e94560', height: 3 },
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                minHeight: 52,
                '&.Mui-selected': { color: '#e94560', fontWeight: 700 },
              },
            }}
          >
            {POLICY_SECTIONS.map((sec) => (
              <Tab key={sec.id} icon={sec.icon} iconPosition="start" label={sec.label} />
            ))}
          </Tabs>
        </Box>

        <DialogContent sx={{ p: { xs: 2.5, md: 3.5 }, maxHeight: '68vh', overflowY: 'auto' }}>
          {/* TAB 0: ABOUT US */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom color="#fff">
                About IMovies
              </Typography>
              <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 2.5, lineHeight: 1.8 }}>
                IMovies is India’s next-generation digital cinema ticketing and entertainment ecosystem. Founded with a vision to redefine the big-screen experience, we bring state-of-the-art auditorium technology, real-time seat reservation, and contactless access right to your fingertips.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  {
                    title: '150+ Premium Screens',
                    desc: 'IMAX 4K Laser, Dolby Atmos, 4DX Sensory, and VIP Recliners across India.',
                  },
                  {
                    title: 'Instant QR M-Tickets',
                    desc: 'Zero queueing at box offices. Walk straight into the theatre with digital mobile passes.',
                  },
                  {
                    title: 'Secure One-Click Booking',
                    desc: 'Bank-grade 256-bit SSL encrypted payments via UPI, Cards, Net Banking, and Wallets.',
                  },
                  {
                    title: 'Fair & Easy Cancellations',
                    desc: 'Flexible cancellation window up to 2 hours prior to scheduled showtimes.',
                  },
                ].map((feat, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700} color="#e94560" gutterBottom>
                        {feat.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {feat.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" fontWeight={700} gutterBottom color="#fff">
                Our Mission
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                We believe stories are best experienced collectively in the dark, bathed in cinematic brilliance. Whether it’s an action blockbuster, an indie masterwork, or an animated family adventure, IMovies delivers seamless booking so you can focus entirely on the thrill of the show.
              </Typography>
            </Box>
          )}

          {/* TAB 1: FAQS */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom color="#fff">
                Frequently Asked Questions (FAQs)
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5 }}>
                Got questions? Find immediate answers to common ticketing, showtime, and account queries.
              </Typography>

              {[
                {
                  q: 'How do I book movie tickets on IMovies?',
                  a: 'Navigate to the Movies section or select a film from the Home page. Choose your preferred city and cinema hall, select your desired show date and time slot, pick your seats from the interactive seat map, and complete payment using your preferred payment method.',
                },
                {
                  q: 'Why can’t I book tickets for "Coming Soon" movies?',
                  a: 'Movies labeled "Coming Soon" have not yet had their certified theatre show schedules finalized by distribution studios. Advance ticket booking opens once showtimes are published. You can explore synopsis, star cast, trailers, and release countdowns in the meantime.',
                },
                {
                  q: 'Can I book a movie show that has already passed or started?',
                  a: 'No. To ensure integrity and safety for moviegoers and cinema operators, all showtimes lock automatically the moment their scheduled start time arrives (e.g., a 1:00 PM show cannot be booked at 1:01 PM or 3:00 PM).',
                },
                {
                  q: 'How do I access my booked tickets at the theatre?',
                  a: 'Go to "My Bookings" in the app menu. Every active reservation displays an instant QR code m-ticket with auditorium number, screen, seat coordinates, and security verification token. Present this QR code at the cinema gate for instant contactless entry.',
                },
                {
                  q: 'What payment modes are accepted on IMovies?',
                  a: 'We accept all major Credit/Debit cards (Visa, MasterCard, RuPay), UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking across 50+ banks, and digital wallets. All transactions are protected by 256-bit SSL encryption.',
                },
                {
                  q: 'Can I select specific seats for my friends and family?',
                  a: 'Yes! Our real-time interactive seat layout displays exact rows and seat numbers, categorized into VIP, Premium, and Standard tiers with live availability status.',
                },
              ].map((item, idx) => (
                <Accordion
                  key={idx}
                  disableGutters
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    mb: 1.5,
                    borderRadius: '8px !important',
                    border: '1px solid rgba(255,255,255,0.06)',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#e94560' }} />}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {item.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                      {item.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom color="#fff">
                Terms and Conditions
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                Last updated: October 2026 • Please read carefully before booking.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    1. Ticket Validity & Admission
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    Each ticket voucher issued by IMovies is valid exclusively for the specific film, date, showtime, cinema hall, screen, and seat allocation printed thereon. Tickets are non-transferable and may not be duplicated or commercially resold at prices exceeding face value.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    2. Age Certification & Statutory Regulations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    Admission to films is governed by the Central Board of Film Certification (CBFC) ratings. Persons under 18 years of age will strictly NOT be admitted to films certified 'A' (Adults Only), even when accompanied by adults. Patrons may be required to present valid government photo identification stating date of birth at the venue.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    3. Outside Food, Drinks & Security
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    In accordance with cinema multiplex exhibitor safety regulations, outside food and beverages are strictly prohibited inside cinema premises. Security frisking and bag checks are mandatory prior to auditorium entry.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    4. Anti-Piracy & Recording Equipment
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    Unauthorized recording, live streaming, or photographic reproduction of any screening using cameras, mobile phones, or audio recorders inside the auditorium is a punishable federal criminal offense under Section 6AA of the Cinematograph Act.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom color="#fff">
                Privacy Policy
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                We respect your personal data and protect your digital privacy.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    1. Information We Collect
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    When you register, browse, or purchase cinema tickets, we collect essential identifiers including your full name, email address, mobile phone number, preferred city, and transaction booking records to facilitate seamless booking verification and customer support.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    2. Payment Security & PCI-DSS Compliance
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    IMovies does NOT store your complete credit card numbers, CVV codes, or net banking passwords on our servers. All financial transactions are directly routed through PCI-DSS Level 1 certified payment gateways with 256-bit end-to-end encryption.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    3. Zero Third-Party Data Selling
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    We do not sell, rent, or lease your personal information to third-party telemarketers or advertisers. Your phone number and email are used exclusively for sending booking confirmations, m-tickets, payment receipts, and critical screening notices.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    4. Data Subject Rights
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    You retain full control over your user profile. You can review, update, or request deletion of your account and personal preferences at any time by contacting privacy@imovies.com.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* TAB 4: REFUND POLICY */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom color="#fff">
                Refund & Cancellation Policy
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label="100% Ticket Base Refund" color="success" size="small" sx={{ fontWeight: 700 }} />
                <Chip label="Up to 2 Hours Before Showtime" color="info" size="small" sx={{ fontWeight: 700 }} />
                <Chip label="Automatic Gateway Reversal" color="warning" size="small" sx={{ fontWeight: 700 }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    1. Cancellation Window
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    Tickets may be cancelled directly from your account under the "My Bookings" section up to <strong>2 hours prior</strong> to the scheduled showtime. Once the 2-hour cutoff passes, showtime locks for auditorium seat management and cancellations can no longer be processed.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    2. Refund Amount & Calculation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    Upon successful cancellation, <strong>100% of the movie ticket base price</strong> will be refunded. Internet convenience fees and statutory taxes charged by payment aggregators are non-refundable in accordance with cinema exhibitor guidelines.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    3. Refund Processing Timeline
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    Refunds are initiated immediately upon cancellation. The credited amount reflects back in your original source account (UPI, Credit/Debit card, or Net Banking) within <strong>3 to 5 working bank business days</strong>.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    4. Screen Disruption or Force Majeure Cancellations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    In the rare event that a screening is cancelled or terminated due to technical malfunction, projector failure, power outage, or government directive, patrons will receive an <strong>unconditional 100% refund</strong> including all convenience fees and taxes within 24 hours.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#e94560">
                    5. Refund Support Escalation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    For queries regarding pending refunds, please email <strong>refunds@imovies.com</strong> with your Booking ID, or call our 24x7 toll-free helpline at <strong>+91 98765 43210</strong>.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={{
              background: 'linear-gradient(45deg, #e94560, #ff6b81)',
              fontWeight: 700,
              px: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Footer;
