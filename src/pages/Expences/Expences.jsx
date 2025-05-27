import { Box, Dialog, styled, ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const StyledDialog = styled(Dialog)({
    backgroundColor: "var(--secondary-color)",
})

const Expences = () => {

    return (
        <div className='div-main'>
            <h2>Expences Tracking</h2>
            <Box //garis
                sx={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: 'var(--secondary-font-color)',
                    marginBottom: '2rem',
                }}
            />
            <Link to='/expences/add' >
                <button className='btn-main'> Add Expences </button>
            </Link>

            <div sx={{ bgcolor: 'red', width: '100%', height: '100%' }}>
                <ThemeProvider
                
                    width='100%'
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

export default Expences