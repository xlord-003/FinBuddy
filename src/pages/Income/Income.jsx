import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
// import "./Income.css";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const user = auth.currentUser;
        console.log("Current user:", user);
        if (user) {
          const q = query(collection(db, "income"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const incomeList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Income list:", incomeList);
          setIncomes(incomeList);
          setIsLoading(false);
        } else {
          console.log("No user logged in");
          toast.error("Silakan login terlebih dahulu", {
            autoClose: 3000,
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Error fetching incomes: ", error);
        toast.error("Gagal mengambil data pendapatan: " + error.message, {
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
    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "income", id));
      setIncomes(incomes.filter((income) => income.id !== id));
      toast.success("Pendapatan berhasil dihapus!", {
        autoClose: 3000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error deleting income: ", error);
      toast.error("Gagal menghapus pendapatan: " + error.message, {
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

  const handleEdit = (id) => {
    navigate(`/income/edit/${id}`); // Sesuaikan dengan rute params
  };


  return (
    <div className="div-main">
      <h2>Income Management</h2>
      <Box
        sx={{
          height: "1px",
          width: "100%",
          backgroundColor: "var(--secondary-font-color)",
          marginBottom: "2rem",
        }}
      />

      {isLoading ? (
        <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
          <CircularProgress />
          <Typography>Loading...</Typography>
        </div>
      ) : (
        incomes.length === 0 ? (
          <Box
            sx={{
              width: "100%",
              height: 150,
              borderRadius: 1,
              bgcolor: "var(--secondary-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: "20px",
            }}
          >
            <label style={{ marginTop: "1rem" }}>
              You have not yet entered your monthly financial data!
            </label>
            <Link to="/income/add">
              <button className="btn-main">Add Income</button>
            </Link>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              minHeight: 170,
              borderRadius: 1,
              bgcolor: 'var(--secondary-color)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="body1" color="white">
              "You have filled in your financial data!"
            </Typography>
            {incomes.map((income) => (
              <Box
                key={income.id}
                sx={{
                  padding: 2,
                  border: "0px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(income.id)}
                  sx={{ mr: 2 }}
                >
                  Edit
                </Button>
                <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(income.id)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'error.main', 
                    color: 'white', 
                    borderColor: 'error.main', 
                  },
                }}
              >
                Delete
              </Button>
              </Box>
            ))}

          </Box>
        )
      )}

    </div>
  );
};

export default Income;