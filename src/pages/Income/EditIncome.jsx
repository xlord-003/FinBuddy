import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { Box, Button, Grid } from "@mui/material";

const EditIncome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    income: "",
    scholarship: "",
    tuition_fee: "",
  });

  // Ambil ID dari URL parameter
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  // Ambil data dari Firestore saat komponen dimuat
  useEffect(() => {
    const fetchIncomeData = async () => {
      if (!id) {
        toast.error("ID tidak ditemukan", {
          autoClose: 3000,
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        navigate("/income");
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error("Silakan login terlebih dahulu", {
            autoClose: 3000,
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          navigate("/login");
          return;
        }

        const docRef = doc(db, "income", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Pastikan data sesuai dengan struktur yang diharapkan
          setFormData({
            income: data.income?.toString() || "",
            scholarship: data.scholarship?.toString() || "",
            tuition_fee: data.tuition_fee?.toString() || "",
          });
        } else {
          toast.error("Data tidak ditemukan", {
            autoClose: 3000,
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          navigate("/income");
        }
      } catch (error) {
        console.error("Error fetching income data: ", error);
        toast.error("Gagal mengambil data: " + error.message, {
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

    fetchIncomeData();
  }, [id, navigate]);

  const handleEdit = async () => {
    if (!id) {
      toast.error("ID tidak ditemukan", {
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

    try {
      const user = auth.currentUser;
      if (!user) {
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

      const docRef = doc(db, "income", id);
      await updateDoc(docRef, {
        income: parseFloat(formData.income || 0),
        scholarship: parseFloat(formData.scholarship || 0),
        tuition_fee: parseFloat(formData.tuition_fee || 0),
      });

      toast.success("Pendapatan berhasil diperbarui!", {
        autoClose: 3000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      navigate("/income");
    } catch (e) {
      console.error("Error updating document: ", e);
      toast.error("Gagal memperbarui pendapatan: " + e.message, {
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
          width: 900,
          height: 500,
          backgroundColor: "var(--secondary-color)",
          borderRadius: "10px",
          p: 2,
        }}
      >
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid>
            <label className="label-add">Edit Finance</label>
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
              onClick={handleEdit}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default EditIncome;