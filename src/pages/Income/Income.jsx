import React from 'react'
import { Box, Container, ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
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
      <Link to='/income/add'>
        <button className='btn-main'> Add Income </button>
      </Link>

      <div >
        <ThemeProvider
          theme={{
            palette: {
              primary: {
                main: 'var(--secondary-color)',
              },
            },
          }}
        >
          <Box
            sx={{
              width: 500,
              height: 100,
              borderRadius: 1,
              bgcolor: 'primary.main',
            }}
          />
        </ThemeProvider>
      </div>

    </div>

  )
}

export default Income