import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Box, Button, Grid } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';
const AddExpences = () => {
    const [page, setPage] = React.useState(1);
    const [formData, setFormData] = React.useState({});
    const totalPages = 8;
    const week = Math.ceil(page / 2);

    const backExpences = useNavigate();

    // Definisikan kategori pengeluaran utama
    const expenseCategories = [
        "Housing",
        "Food",
        "Transport",
        "Books_supplies",
        "Entertainment",
        "Personal_care",
        "Technology",
        "Health_wellnes",
        "Miscelaounus",
        "Tuition"
    ];

    // total untuk jumbal minggu
    const numberOfWeeks = 4;

    // PAGE SESUAI MINGGU
    const renderInputs = () => {
        // array allInputlooping
        const allInput = [];
        for (let i = 1; i <= numberOfWeeks; i++) {
            expenseCategories.forEach(category => {
                allInput.push({ name: `${category}_${i}`, label: category.replace('_', ' ') }); // .replace untuk label yang lebih rapi
            });
        }

        // untuk menghitung indeks input berdasarkan halaman/week
        const startIndex = ((week - 1) * 10) + ((page - 1) % 2) * 5;
        const endIndex = startIndex + 5;

        const inputsToShow = allInput.slice(startIndex, endIndex);

        return inputsToShow.map(({ name, label }) => <Input key={name} name={name} label={label} />);
    };


    // SIMPAN DATA
    const Input = ({ name, label }) => (
        <div className="form-input">
            <label className="title-add" htmlFor={name}>{label}</label>
            <NumericFormat
                id={name}
                name={name}
                title={label + ", week-" + week}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                allowNegative={false}
                value={formData[name] || ""}
                onValueChange={(values) => {
                    const { value } = values; // yang disimpan "cth = 100000"
                    setFormData((prev) => ({
                        ...prev,
                        [name]: value
                    }));
                }}
                customInput={inputProps => <input {...inputProps} />}
                required
            />
        </div>
    );

    const handleSubmit = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                alert("User belum login");
                return;
            }

            const uid = user.uid;

            const monthsCollectionRef = collection(db, "expenses", uid, "months");
            const monthsSnapshot = await getDocs(monthsCollectionRef);

            // untuk nomor moon_....
            const nextMoonNumber = monthsSnapshot.size + 1;
            const monthDocumentName = `moon_${nextMoonNumber}`;

            const weekData = {};
            for (let i = 1; i <= numberOfWeeks; i++) {
                const weekKey = `week_${i}`;
                weekData[weekKey] = {};
                expenseCategories.forEach(category => {
                    weekData[weekKey][category] = parseFloat(formData[`${category}_${i}`] || 0);
                });
            }

            // looping utk mempersipakan perdata
            const totalData = {};
            expenseCategories.forEach(category => {
                totalData[`Total_${category}`] = 0; // Inisialisasi total untuk setiap kategori
            });

            // untuk menghitung total
            Object.keys(weekData).forEach(week => {
                for (const category in weekData[week]) {
                    if (totalData.hasOwnProperty(`Total_${category}`)) {
                        totalData[`Total_${category}`] += weekData[week][category];
                    }
                }
            });

            // datanya
            const monthDocRef = doc(db, "expenses", uid, "months", monthDocumentName);

            // Save Data
            const dataToSave = {
                week: weekData,
                total: totalData,
                // timestamp: new Date() //untuk waktu realtime jika mau
            };

            await setDoc(monthDocRef, dataToSave);

            console.log("Expenses saved to subcollection:", monthDocumentName);
            backExpences("/expences");

        } catch (e) {
            console.error("Error saving expenses: ", e);
            alert("Gagal menyimpan data.");
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    return (
        <div className='div-add'>
            <h2>Add New Expences</h2>
            <Box sx={{
                width: 900,
                height: 500,
                backgroundColor: 'var(--secondary-color)',
                borderRadius: '10px',
                p: 2

            }}>
                <Grid container sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Button
                            variant="text"
                            onClick={handlePrev}
                            disabled={page === 1}
                            sx={{
                                width: '30px',
                                height: '30px',
                                minWidth: 'unset',
                                borderRadius: '100%',
                                color: 'var(--primary-font-color)',
                            }}
                        >
                            <ArrowBackRoundedIcon sx={{ width: '30px', height: '30px' }} />
                        </Button>
                        <h4 style={{ margin: '0 0 0 -1.5rem', }}>Week {week}</h4>
                        <Box />
                    </Box>
                </Grid>
                <Grid container sx={{ paddingRight: '1rem', alignItems: 'center', justifyContent: 'center', height: '87%', mt: -1 }}>
                    <Grid size={10}>
                        {renderInputs()}
                    </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: 'end', paddingRight: '4.9rem' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {page === totalPages ? (
                            <Button
                                variant='contained'
                                onClick={handleSubmit}
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                Add
                            </Button>
                        ) : (
                            <Button
                                variant='contained'
                                onClick={handleNext}
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Box>
        </div>
    );
}

export default AddExpences;