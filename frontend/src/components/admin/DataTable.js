import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DataTable = ({
  columns = [],
  rows = [],
  searchPlaceholder = 'Search table...',
  searchField = 'title',
  loading = false,
  emptyMessage = 'No records found',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredRows = rows.filter((row) => {
    if (!searchTerm) return true;
    const value = row[searchField];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        backgroundColor: '#16213e',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Search Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
        <Typography variant="caption" color="text.secondary">
          Showing {filteredRows.length} entries
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 0.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  Loading records...
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row._id || index}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                      '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' },
                    }}
                  >
                    {columns.map((col) => {
                      const value = row[col.id];
                      return (
                        <TableCell key={col.id} align={col.align || 'left'}>
                          {col.render ? col.render(row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          color: 'text.secondary',
        }}
      />
    </Paper>
  );
};

export default DataTable;
