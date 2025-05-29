import React from 'react'
import { Box, Container, ThemeProvider } from '@mui/material'
import { Link } from 'react-router-dom';


const Income = () => {
  return (

    <div className='div-main'>
      <h2>Income Management</h2>
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
          Text.............................................................Income
        </label>
        <Link to='/income/add'>
          <button className='btn-main'> Add Income </button>
        </Link>
      </Box>

    </div>

  )
}

export default Income