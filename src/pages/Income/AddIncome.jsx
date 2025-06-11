import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { Box, Button, Grid } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

const AddIncome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    income: "",
    scholarship: "",
    tuition_fee: "",
  });

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    try {
      if (!currentUserId) {
        toast.error("Silakan login terlebih dahulu", {
          autoClose: 3000,
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }
      const docRef = doc(db, "income", currentUserId);
      // Tambah dokumen baru ke koleksi "income"
      await setDoc(docRef, {
        userId: currentUserId, // Tambahkan userId
        income: parseFloat(formData.income || 0),
        scholarship: parseFloat(formData.scholarship || 0),
        tuition_fee: parseFloat(formData.tuition_fee || 0),
      });


      toast.success("Pendapatan berhasil ditambahkan!", {
        autoClose: 3000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Reset form
      setFormData({
        income: "",
        scholarship: "",
        tuition_fee: "",
      });

      navigate("/income");
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Gagal menambahkan pendapatan: " + e.message, {
        autoClose: 3000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="div-add">
      <Box
        sx={{
          width: { xs: '95%', sm: '90%', md: 900 },
          minHeight: 500,
          backgroundColor: 'var(--secondary-color)',
          borderRadius: '10px',
          p: { xs: 1.5, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid>
            <label className="label-add">Add Finance</label>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            paddingRight: "10px",
            alignItems: "center",
            justifyContent: "center",
            height: "80%",
          }}
        >
          <Grid size={10}>
            <div className="form-input">
              <label className="title-add" htmlFor="Income">
                Income
              </label>
              <NumericFormat
                value={formData.income}
                name="income"
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                customInput="input"
                onValueChange={(values) => {
                  setFormData((prev) => ({
                    ...prev,
                    income: values.value,
                  }));
                }}
                required
              />
            </div>
            <div className="form-input">
              <label className="title-add" htmlFor="Scholarship">
                Scholarship
              </label>
              <NumericFormat
                value={formData.scholarship}
                name="scholarship"
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                customInput="input"
                onValueChange={(values) => {
                  setFormData((prev) => ({
                    ...prev,
                    scholarship: values.value,
                  }));
                }}
                required
              />
            </div>
            <div className="form-input">
              <label className="title-add" htmlFor="Tuition_fee">
                Tuition Fee
              </label>
              <NumericFormat
                value={formData.tuition_fee}
                name="tuition_fee"
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                customInput="input"
                onValueChange={(values) => {
                  setFormData((prev) => ({
                    ...prev,
                    tuition_fee: values.value,
                  }));
                }}
                required
              />
            </div>
          </Grid>
        </Grid>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid>
            <Button
              variant="contained"
              sx={{
                minWidth: "unset",
                width: "140px",
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
};

AddIncome.propTypes = {};

export default AddIncome;