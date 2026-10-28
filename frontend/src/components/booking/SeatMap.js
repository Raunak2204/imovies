import React from 'react';
import { Box, Typography, Paper, Tooltip, Stack, Chip } from '@mui/material';
import WeekendIcon from '@mui/icons-material/Weekend';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const COLS = 15;

const getSeatType = (row) => {
  if (['A', 'B'].includes(row)) return 'vip';
  if (['C', 'D', 'E'].includes(row)) return 'premium';
  return 'regular';
};

const SeatMap = ({
  seatMap = {},
  selectedSeats = [],
  onSeatToggle,
  prices = { regular: 200, premium: 350, vip: 500 },
  maxSelectable = 10,
}) => {
  const isSeatBooked = (seatId) => {
    return seatMap[seatId] === 'booked' || seatMap[seatId] === 'blocked';
  };

  const isSeatSelected = (seatId) => {
    return selectedSeats.includes(seatId);
  };

  const handleSeatClick = (seatId) => {
    if (isSeatBooked(seatId)) return;
    onSeatToggle(seatId);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: '#16213e',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        overflowX: 'auto',
      }}
    >
      {/* Screen Indicator */}
      <Box sx={{ mb: 4 }}>
        <div className="screen-indicator" />
        <Typography className="screen-text">All eyes this way • Screen</Typography>
      </Box>

      {/* Grid of seats */}
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 1.2,
          minWidth: 540,
          mb: 4,
        }}
      >
        {ROWS.map((row) => {
          const seatType = getSeatType(row);
          const price = prices[seatType] || 200;

          return (
            <Box
              key={row}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.8,
              }}
            >
              {/* Row Label Left */}
              <Typography
                variant="caption"
                sx={{
                  width: 24,
                  fontWeight: 'bold',
                  color: seatType === 'vip' ? '#ffd700' : seatType === 'premium' ? '#2196f3' : '#b0b0b0',
                }}
              >
                {row}
              </Typography>

              {/* Seats in row */}
              <Box sx={{ display: 'flex', gap: 0.8 }}>
                {Array.from({ length: COLS }, (_, i) => i + 1).map((col) => {
                  const seatId = `${row}${col}`;
                  const booked = isSeatBooked(seatId);
                  const selected = isSeatSelected(seatId);

                  let seatClass = `seat ${seatType}`;
                  if (booked) seatClass += ' booked';
                  else if (selected) seatClass += ' selected';
                  else seatClass += ' available';

                  // Add spacing for aisles (after 3 and 12)
                  const isAisle = col === 3 || col === 12;

                  return (
                    <React.Fragment key={seatId}>
                      <Tooltip
                        title={
                          booked
                            ? `Seat ${seatId} (Booked)`
                            : `Seat ${seatId} • ${seatType.toUpperCase()} (₹${price})`
                        }
                        arrow
                      >
                        <div
                          className={seatClass}
                          onClick={() => handleSeatClick(seatId)}
                          role="button"
                          tabIndex={0}
                        >
                          {col}
                        </div>
                      </Tooltip>
                      {isAisle && <Box sx={{ width: 14 }} />}
                    </React.Fragment>
                  );
                })}
              </Box>

              {/* Row Label Right */}
              <Typography
                variant="caption"
                sx={{
                  width: 24,
                  fontWeight: 'bold',
                  color: seatType === 'vip' ? '#ffd700' : seatType === 'premium' ? '#2196f3' : '#b0b0b0',
                }}
              >
                {row}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Seat Pricing & Tiers */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
          mb: 3,
          pt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Chip
          icon={<WeekendIcon sx={{ color: '#ffd700 !important' }} />}
          label={`VIP (Rows A-B): ₹${prices.vip || 500}`}
          variant="outlined"
          sx={{ borderColor: 'rgba(255, 215, 0, 0.4)', color: '#ffd700' }}
        />
        <Chip
          icon={<WeekendIcon sx={{ color: '#2196f3 !important' }} />}
          label={`Premium (Rows C-E): ₹${prices.premium || 350}`}
          variant="outlined"
          sx={{ borderColor: 'rgba(33, 150, 243, 0.4)', color: '#2196f3' }}
        />
        <Chip
          icon={<WeekendIcon sx={{ color: '#4caf50 !important' }} />}
          label={`Regular (Rows F-J): ₹${prices.regular || 200}`}
          variant="outlined"
          sx={{ borderColor: 'rgba(76, 175, 80, 0.4)', color: '#4caf50' }}
        />
      </Box>

      {/* Legend */}
      <Stack
        direction="row"
        spacing={{ xs: 2, sm: 4 }}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div className="seat available" style={{ width: 22, height: 22, cursor: 'default' }} />
          <Typography variant="caption" color="text.secondary">
            Available
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div className="seat selected" style={{ width: 22, height: 22, cursor: 'default' }} />
          <Typography variant="caption" color="text.secondary">
            Selected
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div className="seat booked" style={{ width: 22, height: 22, cursor: 'default' }} />
          <Typography variant="caption" color="text.secondary">
            Booked
          </Typography>
        </Box>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        * Maximum {maxSelectable} seats per booking
      </Typography>
    </Paper>
  );
};

export default SeatMap;
