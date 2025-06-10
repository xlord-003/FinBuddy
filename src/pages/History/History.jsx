import React, { useState, useEffect, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { toast } from 'react-toastify';
import Chatbot from '../Dashboard/Chatbot';

// tabel Expenses
const columnsExpenses = [
  { id: 'name', label: 'Expenditure Category', minWidth: 170 },
  {
    id: 'week1',
    label: 'First week',
    minWidth: 100,
    align: 'right',
    format: (value) => (typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : value),
  },
  {
    id: 'week2',
    label: 'Second week',
    minWidth: 100,
    align: 'right',
    format: (value) => (typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : value),
  },
  {
    id: 'week3',
    label: 'Third week',
    minWidth: 100,
    align: 'right',
    format: (value) => (typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : value),
  },
  {
    id: 'week4',
    label: 'Fourth week',
    minWidth: 100,
    align: 'right',
    format: (value) => (typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : value),
  },
  {
    id: 'totalCategory',
    label: 'Total',
    minWidth: 120,
    align: 'right',
    format: (value) => (typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : value),
  }
];

// tabel Income
const columnsIncome = [
  { id: 'source', label: 'Source of Income', minWidth: 170 },
  {
    id: 'amount',
    label: 'Total',
    minWidth: 100,
    align: 'right',
    format: (value) => (typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : value),
  },
];

const expenseCategories = [
  "Housing", "Food", "Transport", "Books_supplies", "Entertainment",
  "Personal_care", "Technology", "Health_wellnes", "Miscelaounus", "Tuition"
];

const History = () => {
  const [incomeRows, setIncomeRows] = useState([]);
  const [expenseRows, setExpenseRows] = useState([]);
  const [overallTotals, setOverallTotals] = useState({}); // total dari expenses
  const [isLoading, setIsLoading] = useState(true);
  const [currentUID, setCurrentUID] = useState(null);

  // id pengguna saat ini
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUID(user.uid);
      } else {
        setCurrentUID(null);
        setIsLoading(false); // tidak ada user
        setIncomeRows([]);
        setExpenseRows([]);
        setOverallTotals({});
      }
    });
    return () => unsubscribe();
  }, []);

  // mengambil dan memproses data
  const fetchData = useCallback(async (uid) => {
    if (!uid) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      // Income
      const incomeDocRef = doc(db, "income", uid);
      const incomeDocSnap = await getDoc(incomeDocRef);
      const newIncomeRows = [
        { id: 'income_source', source: 'Income', amount: 0 },
        { id: 'scholarship_source', source: 'Scholarship', amount: 0 },
        { id: 'tuition_fee_source', source: 'Tuition fee', amount: 0 },
      ];
      if (incomeDocSnap.exists()) {
        const incomeData = incomeDocSnap.data();
        // nama dalam tabel
        newIncomeRows[0].amount = incomeData.income || 0;
        newIncomeRows[1].amount = incomeData.scholarship || 0;
        newIncomeRows[2].amount = incomeData.tuition_fee || 0;
      }
      setIncomeRows(newIncomeRows);

      // Expenses
      const expensesDocRef = doc(db, "expenses", uid);
      const expensesDocSnap = await getDoc(expensesDocRef);
      const newExpenseRows = [];
      let fetchedOverallTotals = {};

      if (expensesDocSnap.exists()) {
        const expensesData = expensesDocSnap.data();
        fetchedOverallTotals = expensesData.overall_totals || {}; // nilai total perbaris
        setOverallTotals(fetchedOverallTotals);

        expenseCategories.forEach(category => {
          const row = {
            id: category.toLowerCase().replace(/_/g, '-'),
            name: category.replace(/_/g, ' '),
            week1: expensesData.week_1?.[category] || 0,
            week2: expensesData.week_2?.[category] || 0,
            week3: expensesData.week_3?.[category] || 0,
            week4: expensesData.week_4?.[category] || 0,
            totalCategory: fetchedOverallTotals[`Total_${category}`] || 0
          };
          newExpenseRows.push(row);
        });
      }
      setExpenseRows(newExpenseRows);

    } catch (error) {
      console.error("Error fetching data for history:", error);
      toast.error("Gagal memuat data riwayat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUID) {
      fetchData(currentUID);
    }
  }, [currentUID, fetchData]);

  // if (!currentUID) {
  //     toast.error("Silakan login terlebih dahulu", {
  //       autoClose: 3000,
  //       position: "top-right",
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       theme: "colored",
  //     })
  // }
  if (isLoading) {
    return (
      <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </div>
    );
  }


  return (
    <div className="div-main">
      <Box sx={{ marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingX: { xs: 1, md: 2 } }}>
        {/* Income */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom component="h2" sx={{ fontWeight: 'bold' }}>
            Income
          </Typography>
          {incomeRows.length > 0 ? (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 230, width: '100%' }}>
                <Table stickyHeader aria-label="sticky income table">
                  <TableHead>
                    <TableRow>
                      {columnsIncome.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth, backgroundColor: 'var(--table-header-bg, #f0f0f0)', fontWeight: 'bold', color: 'var(--table-header-color, #333)' }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incomeRows.map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columnsIncome.map((column) => {
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Typography sx={{ mt: 2, color: 'white' }}>There is no revenue data recorded yet.</Typography>
          )}
        </Box>

        {/* Expenses */}
        <Box>
          <Typography variant="h4" gutterBottom component="h2" sx={{ fontWeight: 'bold' }}>
            Expenses
          </Typography>
          {expenseRows.length > 0 ? (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 250 }}>
                <Table stickyHeader aria-label="sticky expenses table">
                  <TableHead>
                    <TableRow>
                      {columnsExpenses.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth, backgroundColor: 'var(--table-header-bg, #f0f0f0)', fontWeight: 'bold', color: 'var(--table-header-color, #333)' }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenseRows.map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columnsExpenses.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : (value !== undefined ? value : '-')}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Typography sx={{ mt: 2, color: 'white' }}>There is no revenue data recorded yet.</Typography>
          )}
        </Box>
        <Chatbot />
      </Box>
    </div>
  );
}

export default History;