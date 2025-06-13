# FinBuddy
<p align="center">
  <a href="https://github.com/xlord-003/FinBuddy/">
    <img src="assets/pic/image-Photoroom.png" alt="Finbuddy logo" height="130">
  </a>
</p>

<p align="center">
  Your Personal Coach for Smarter Saving.
  <br></br>
  </p>
<p align="center">
  <img src="assets/pic/image.png" alt="GitHub Pipenv Linux Version" height="50">
  <img src="assets/pic/image (1).png" alt="GitHub Pipenv Docker Version" height="50">
<!--   <img src="images/ubuntu.webp" alt="GitHub Pipenv Ubuntu version" height="20"> -->
<!--   <img src="https://github.com/HijazP/i-hate-to-budget/blob/main/Image/django%20logo.png" alt="GitHub Pipenv locked Python version" height="20"> -->
  </p>

<p align="center">
  <img src="assets/pic/image (2).png" alt="GitHub Pipenv Linux Version" height="35">
  <img src="assets/pic/image (3).png" alt="GitHub Pipenv Docker Version" height="35">
  <img src="assets/pic/image (4).png" alt="GitHub Pipenv Docker Version" height="35">
  <img src="assets/pic/image (5).png" alt="GitHub Pipenv Docker Version" height="35">
  <img src="assets/pic/image (6).png" alt="GitHub Pipenv Docker Version" height="35">
  <img src="assets/pic/image (7).png" alt="GitHub Pipenv Docker Version" height="35">
  <img src="assets/pic/material.png" alt="GitHub Pipenv Ubuntu version" height="35">
  <img src="assets/pic/css.png" alt="GitHub Pipenv Ubuntu version" height="35">
  <img src="assets/pic/firebase.png" alt="GitHub Pipenv Ubuntu version" height="35">
  <img src="assets/pic/matplotlib.svg" alt="GitHub Pipenv Ubuntu version" height="35">
  <img src="assets/pic/numpy.png" alt="GitHub Pipenv Ubuntu version" height="35">
  <img src="assets/pic/react.webp" alt="GitHub Pipenv Ubuntu version" height="35">
  <img src="assets/pic/seaborn.webp" alt="GitHub Pipenv Ubuntu version" height="35">
  <img src="assets/pic/vscode.png" alt="GitHub Pipenv Ubuntu version" height="35">
  
<!--   <img src="https://github.com/HijazP/i-hate-to-budget/blob/main/Image/django%20logo.png" alt="GitHub Pipenv locked Python version" height="20"> -->
  </p>

[Sekilas Tentang](#sekilas-tentang) | [Pendahuluan](#pendahuluan) | [Kompetitor](#kompetitor) | [Tech Stack](#tech-stack) | [Evaluasi](#evaluasi) 
:---:|:---:|:---:|:---:|:---:|

    
# Sekilas Tentang
https://github.com/user-attachments/assets/1b5cac9e-f46a-4b98-a0eb-b358aa4af8e1

[FinBuddy]("https://github.com/xlord-003/FinBuddy/")<br>
FinBuddy merupakan web aplikasi manajemen keuangan pribadi dengan menyediakan fitur pencatatan pemasukan bulanan, pengeluaran mingguan, analisis pola keuangan disertai visualisasi data informatif. Melalui dashboard interaktif, web aplikasi ini mengklasifikasikan perilaku finansial pengguna ke dalam kategori hemat, normal, atau boros. Tersedia juga fitur chatbot sebagai asisten dalam memudahkan navigasi penggunaan aplikasi. FinBuddy dirancang sebagai solusi praktis dan aman tanpa memerlukan koneksi ke rekening bank atau dompet digital.

## Pendahuluan
[`^ kembali ke atas ^`](#)
### Identifikasi Masalah :
- Tidak sempat mencatat pemasukan dan pengeluaran
- Sulit evaluasi kondisi keuangan
- Kesulitan menentukan alokasi dana yang tepat

### Solusi dari FinBuddy : 
- Fitur pencatatan pemasukan bulanan & pengeluaran mingguan
- Menganalisis pola pengeluaran pengguna dan memberikan visualisasi data yang mudah dipahami
- Memberikan rekomendasi jumlah uang ideal untuk dialokasikan ke dalam beberapa kategori

## Kompetitor 
### Aplikasi Serupa : 
<img src="assets/pic/image (8).png" alt="GitHub Pipenv Ubuntu version" height="180">
Dompetku <br>
- Kemiripan : Menampilkan visualisasi pergerakan keuangan dari pengguna <br>
- Perbedaan : Mengintegrasikan dengan akun resmi bank pengguna. Pada dompetku belum terlihat penggunaan Machine Learning

## Tech Stack

### Kebutuhan Sistem :
- Code Editor: Visual Studio Code, Google Colab
- Frontend : React.js dan Tailwind.css
- Backend : Flask dan Firebase
- Machine Learning : Python, Tensorflow, Scikit-Learn, Numpy, Pandas, Seaborn, Matplotlib

### Struktur Database :
<img src="assets/pic/Gambar WhatsApp 2025-06-13 pukul 01.48.57_56c3d019.jpg" alt="GitHub Pipenv Ubuntu version" height="250">

## Pemodelan
### Skema Chatbot : 
<img src="assets/pic/chatbot.drawio (2).png" alt="GitHub Pipenv Ubuntu version" height="180">

### Skema Klasifikasi : 
- Tahapan Klastering <br>
<img src="assets/pic/Untitled Diagram-Page-1.drawio (1).png" alt="GitHub Pipenv Ubuntu version" height="70"> <br>
- Tahapan Klasifikasi <br>
<img src="assets/pic/Untitled Diagram-Page-2.drawio (1).png" alt="GitHub Pipenv Ubuntu version" height="70"> <br>

## Evaluasi 
### Klastering
#### Elbow Method <br>
<img src="assets/pic/image (9).png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>
#### Area Klaster <br>
<img src="assets/pic/image (10).png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>
#### Proporsi Klaster <br>
<img src="assets/pic/image (11).png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>

### Klasifikasi <br>
#### Train - Val
<img src="assets/pic/image (12).png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>
#### Confussion Matrix
<img src="assets/pic/image (13).png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>
#### Classification Report
<img src="assets/pic/image (14).png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>

## Integrasi Model ke Website :

### Chatbot 
<img src="assets/pic/RENCANA KE DEPAN.png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>
### Klasifikasi Behavior
<img src="assets/pic/RENCANA KE DEPAN (1).png" alt="GitHub Pipenv Ubuntu version" height="180"> <br>

## Keunggulan FinBuddy : <br>
Membantu pengguna menabung lebih efektif dengan rekomendasi personal, menampilkan data keuangan secara interaktif, dan menjaga keamanan tanpa perlu koneksi ke rekening bank/e-wallet <br>

## Rencana ke Depan :
- Pengembangan aplikasi versi mobile
- Penambahan modul edukasi keuangan
- Fitur pendukung keuangan bersama


[`^ kembali ke atas ^`](#)



