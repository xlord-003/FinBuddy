import React, { useState } from 'react'
import { NumericFormat } from 'react-number-format';
import { Box, Button, Grid } from '@mui/material'
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';

const AddIncome = () => {
    const backIncome = useNavigate()
    const [formData, setFormData] = useState({
        income: '',
        scholarship: '',
        tuition_fee: '',
    });

    //CATATAN ID TIDAK SAMA DENGAN ID USER, NANTI UBAH CODENYA *REMEMBER*

    const handleAdd = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                alert("User belum login.");
                return;
            }

            // Simpan data dengan ID income = user UID
            await setDoc(doc(db, "income", user.uid), {
                income: parseFloat(formData.income || 0),
                scholarship: parseFloat(formData.scholarship || 0),
                tuition_fee: parseFloat(formData.tuition_fee || 0),
            });

            backIncome("/income");

            setFormData({
                income: '',
                scholarship: '',
                tuition_fee: '',
            });
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to add data.");
        }
    };

    return (
        <div className='div-add'>
            <Box sx={{
                width: 900,
                height: 500,
                backgroundColor: 'var(--secondary-color)',
                borderRadius: '10px',
                p: 2

            }}>
                <Grid container sx={{ justifyContent: 'center' }}>
                    <Grid>
                        <label className='label-add'>Add Finance</label>
                    </Grid>
                </Grid>
                <Grid container sx={{ paddingRight: '10px', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <Grid size={10}>
                        <div class="form-input">

                            <label class="title-add" For="Income">Income</label>
                            <NumericFormat
                                value={formData.income}
                                name="income"
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="Rp. "
                                customInput="input"
                                onValueChange={(values) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        income: values.value
                                    }));
                                }}
                                required
                            />
                        </div>
                        <div class="form-input">
                            <label class="title-add" For="Scholarship">Scholarship</label>
                            <NumericFormat
                                value={formData.scholarship}
                                name="scholarship"
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="Rp. "
                                customInput="input"
                                onValueChange={(values) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        scholarship: values.value
                                    }));
                                }}
                                required
                            />
                        </div>
                        <div class="form-input">
                            <label class="title-add" For="Tuition_fee">Tuition Fee</label>

                            <NumericFormat
                                value={formData.tuition_fee}
                                name="tuition_fee"
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="Rp. "
                                customInput="input"
                                onValueChange={(values) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        tuition_fee: values.value
                                    }));
                                }}
                                required
                            />

                        </div>
                    </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: 'center', }}>
                    <Grid>
                        <Button variant='contained'
                            sx={{
                                minWidth: 'unset',
                                width: '140px',
                            }}
                            onClick={handleAdd}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

AddIncome.propTypes = {}

export default AddIncome