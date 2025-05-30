import { Box, Dialog, styled, ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const StyledDialog = styled(Dialog)({
    backgroundColor: "var(--secondary-color)",
})

const Expences = () => {

    return (
        <div className='div-main'>
            <h2>Expenses Tracking</h2>
            <Box //garis
                sx={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: 'var(--secondary-font-color)',
                    marginBottom: '2rem',
                }}
            />
            <Box
                sx={{
                    width: '100%',
                    height: 150,
                    borderRadius: 1,
                    bgcolor: 'var(--secondary-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                    paddingTop: '1.5rem',
                }}
            >
                <label margin-top='1rem'>
                    Anda Belum memasukkan Pengeluaran mingguan!
                </label>
                <Link to='/expenses/add' >
                    <button className='btn-main'> Add Expences </button>
                </Link>
            </Box>
        </div>
    )
}

export default Expences