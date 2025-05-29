import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/material';

// Definisi kolom tetap sama, karena id 'name' sudah sesuai
const columns1 = [
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'week1',
    label: 'first week',
    minWidth: 100,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toLocaleString('en-US') : value),
  },
  {
    id: 'week2',
    label: 'second week',
    minWidth: 170,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toLocaleString('en-US') : value),
  },
  {
    id: 'week3',
    label: 'third week',
    minWidth: 170,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toFixed(2) : value),
  },
  {
    id: 'week4',
    label: 'fourth week',
    minWidth: 170,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toLocaleString('en-US') : value),
  },
];

const columns2 = [
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'week1',
    label: 'first week',
    minWidth: 100,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toLocaleString('en-US') : value),
  },
  {
    id: 'week2',
    label: 'second week',
    minWidth: 170,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toLocaleString('en-US') : value),
  },
  {
    id: 'week3',
    label: 'third week',
    minWidth: 170,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toFixed(2) : value),
  },
  {
    id: 'week4',
    label: 'fourth week',
    minWidth: 170,
    align: 'right',
    format: (value) => (typeof value === 'number' ? value.toLocaleString('en-US') : value),
  },
];

// 1. Fungsi createData disederhanakan
function createData(name, week1, week2, week3, week4) {
  return { name, week1, week2, week3, week4 };
}

// 2. Pembuatan rows1 dan rows2 disesuaikan
const rows1 = [
  createData('Housing', 34524, 35000, 33000, 36000),
  createData('Food', 235235, 240000, 230000, 250000),
  createData('Transport', 245345, 250000, 240000, 260000),
  createData('Books supplies', 245432, 250000, 240000, 260000),
  createData('Entertainment', 34523, 35000, 33000, 36000),
  createData('Personal care', 254332, 260000, 250000, 270000),
  createData('Technology', 2353245, 2400000, 2300000, 2500000),
  createData('Health wellnes', 24134, 25000, 23000, 26000),
  createData('Miscelaounus', 235235, 240000, 230000, 250000), // Perhatikan: 'Miscelaounus' mungkin typo untuk 'Miscellaneous'
  createData('Tuition', 54332, 55000, 53000, 56000),
];

const rows2 = [
  createData('Income', 2313, 2400, 2200, 2500),
  createData('Scholarship', 124214, 125000, 123000, 126000),
  createData('Tuition fee', 23432, 24000, 22000, 25000),
];

const History = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Box sx={{ marginTop: '1rem', width: '1230px' }}>
        {/* Income Table */}
        <Box>
          <h2>Income</h2>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 230 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns2.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows2
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        // 3. Properti key diubah menjadi row.name
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                          {columns2.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>            
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Expenses Table */}
        <Box sx={{ marginTop: '2rem' }}>
          <h2>Expenses</h2>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 230 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns1.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows1
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        // 3. Properti key diubah menjadi row.name
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                          {columns1.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </>
  );
}

export default History;