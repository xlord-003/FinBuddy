# FinBuddy
<p align="center">
  <a href="https://github.com/darrelazmi/PassManager/">
    <img src="images/vaultwarden-image.png" alt="IHateToBudget logo" height="130">
  </a>
</p>

<p align="center">
  <img src="images/linux.webp" alt="GitHub Pipenv Linux Version" height="20">
  <img src="images/logo%20docker.png" alt="GitHub Pipenv Docker Version" height="20">
  <img src="images/ubuntu.webp" alt="GitHub Pipenv Ubuntu version" height="20">
<!--   <img src="https://github.com/HijazP/i-hate-to-budget/blob/main/Image/django%20logo.png" alt="GitHub Pipenv locked Python version" height="20"> -->
  </p>

<p align="center">
  Aplikasi web sederhana untuk mengatur password  Anda.
  <br></br>
  <em>Reference by <a href="https://github.com/dani-garcia/vaultwarden">vaultwarden</a>.</em>
</p>

[Sekilas Tentang](#sekilas-tentang) | [Instalasi](#instalasi) | [Otomatisasi](#otomatisasi) | [Cara Pemakaian](#cara-pemakaian) | [Pembahasan](#pembahasan) | [Referensi](#referensi)
:---:|:---:|:---:|:---:|:---:|:---:

    
# Sekilas Tentang
![alt text](images/homejga.png)

[PasswordManager](https://github.com/dani-garcia/vaultwarden)<br>
Vaultwarden merupakan sebuah web app yang bertujuan untuk membantu anda dalam menyimpan password didalam cloud. Pada web app ini, kita dapat menyimpan password dengan menandai tipe password, nama dari passwordnya, username dan tentunya juga password yang ingin kita simpan di cloud. Kelebihan yang didapatkan dari web app ini adalah password yang disimpan di Vaultwarden memiliki keamanan extra dari server yang membuat password yang disimpan di web ini jauh lebih aman.

## Instalasi
[`^ kembali ke atas ^`](#)

### Kebutuhan Sistem :
- Sistem Operasi: Linux Ubuntu
- Docker: Docker versi terbaru
- RAM: 64Mb atau lebih tinggi

### Proses Instalasi :
#### Docker
Proses instalasi menggunakan Docker hanyalah salah satu cara, banyak cara lainnya yang bisa disesuaikan dengan preferensi masing-masing.

1. *Hapus* package yang konflik:
```
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

2. *Add Docker's* official GPG key:
```
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

3. *Add the Repository* to Apt sources:
```
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```


4. *Install* the latest version of docker package:
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### INSTALL CONTAINER VAULTWARDEN

- Install Vaultwarden dari public docker repo.
```
docker run --name vaultwarden --hostname vaultwarden \
  --network proxy-net --volume ./vaultwarden:/data --detach \
  vaultwarden/server
```

#### INSTALL CONTAINER CADDY

- Install Caddy:
```
docker run --name caddy --network proxy-net \
  --publish 80:80 --publish 443:443 --detach \
  caddy caddy reverse-proxy --from <your-domain> --to vaultwarden:80
```
Note: Ubah `<your-domain>` menjadi domain milik Anda.
  
## Otomatisasi
[`^ kembali ke atas ^`](#)

Cara lain untuk mempersingkat proses instalasi adalah menggunakan *shell script*. *Shell script* adalah kumpulan kode yang dapat dijalankan di Unix shell. Anda bisa menngunakan *shell script* yang sudah kami buat untuk instalasi dengan petunjuk berikut:

#### Download `setup.sh` menggunakan `curl`
```
curl -LO https://github.com/darrelazmi/PassManager/blob/main/shell/setup.sh
```

### Ubah `<your-domain>` menjadi nama domain anda
Misalkan domain anda adalah vault.yourdomain.com
```
sed -i 's/<your-domain>/vault.yourdomain.com/g' setup.sh
```

#### Jalankan dengan perintah `./setup.sh`
```
./setup.sh
```
*Shell script* `setup.sh` berisi kumpulan perintah untuk instalasi vaultwarden.


## Cara Pemakaian
[`^ kembali ke atas ^`](#)
- Tampilan Aplikasi Web
    - Tampilan Halaman Log In
        ![alt text](images/login.png)
    - Tampilan Halaman Daftar
        ![alt text](images/signup.png)
    - Tampilan Utama Aplikasi
        ![alt text](images/homejga.png)
- Fungsi-fungsi utama
    - Menambah Password Baru
        ![alt text](images/home.png)
    - Dapat Membuat Password Sesuai Kebutuhan dan Kriteria Yang Diinginkan
        ![image](images/PasswordGenerator.png)
    - Dapat Mengunggah Data Sesuai Kebutuhan
        ![image](images/Importvault.png)
    - Dapat Mengekstrak Data Dari Dalam Web
        ![image](images/Exportvault.png)
    - Memberikan Laporan Terkait Keamanan Password
        ![image](images/Reports.png)
    - Mengirim File atau Teks
        ![image](images/Send.png)
- Contoh Penggunaan
    - Contoh Penggunaan Vaultwarden Untuk Mengisi Password
        ![alt text](images/loginexample.png)

## Pembahasan
[`^ kembali ke atas ^`](#)

- Pendapat anda tentang aplikasi web ini
    - ### Kelebihan
      1. Keamanan Tinggi: Vaultwarden menawarkan keamanan ekstra dengan server yang melindungi data yang disimpan, termasuk enkripsi yang baik untuk melindungi password.
      2. Self-hosting: Aplikasi ini bisa di-host sendiri, sehingga pengguna memiliki kontrol penuh atas data mereka tanpa perlu khawatir tentang pihak ketiga.
      3. Integrasi Docker: Menggunakan Docker memudahkan proses instalasi dan pengelolaan aplikasi, memberikan fleksibilitas dan kemudahan dalam deployment.
      4. Manajemen Password yang Mudah: Vaultwarden memungkinkan pengelolaan password dengan tipe-tipe khusus, membuatnya lebih terstruktur dan mudah diakses.

    - ### Kekurangan
      1. Konfigurasi Awal yang Rumit: Proses instalasi memerlukan beberapa langkah teknis, terutama bagi pengguna yang kurang familiar dengan Docker dan Linux.
      2. Ketergantungan pada Docker: Pengguna yang tidak terbiasa dengan Docker mungkin menghadapi kesulitan dalam mengelola container.
      3. Tidak User-friendly: Antarmuka dan pengelolaan Vaultwarden mungkin terlalu teknis bagi pengguna awam, terutama yang tidak terbiasa dengan konsep self-hosting.
      4. Terbatas pada Lingkungan Self-hosted: Tidak cocok bagi pengguna yang ingin menggunakan aplikasi tanpa mengelola server sendiri.
     
- Bandingkan dengan aplikasi web lain yang sejenis
  - ### Google Password Manager
    1. Keamanan: Tersimpan di akun Google dengan enkripsi, namun data di-host di server Google, yang berpotensi lebih rentan terhadap serangan atau pelanggaran privasi dibandingkan dengan solusi self-hosted.
    2. Kemudahan Penggunaan: Sangat mudah digunakan, namun kesederhanaannya dapat menurunkan kontrol atas pengelolaan kata sandi yang lebih rinci.
    3. Privasi: Data sepenuhnya di-host oleh Google, yang berarti pengguna harus mempercayakan privasi mereka pada perusahaan pihak ketiga. Ini bisa menjadi risiko bagi pengguna yang lebih sadar akan privasi.
    4. Sinkronisasi: Otomatis di semua perangkat yang menggunakan akun Google, tetapi tergantung pada infrastruktur Google, yang bisa menjadi titik lemah jika terjadi pelanggaran data.
    5. Fitur Tambahan: Memiliki fitur pemeriksaan keamanan kata sandi, namun kurang fleksibel dalam manajemen kata sandi dan tidak memiliki opsi pengelolaan mandiri seperti Vaultwarden.

## Referensi
- [Docker](https://www.docker.com/)
- [Vaultwarden](https://github.com/dani-garcia/vaultwarden/)
- [Google Password Manager](https://passwords.google.com/)

[`^ kembali ke atas ^`](#)



## Demo Video
https://github.com/user-attachments/assets/1b5cac9e-f46a-4b98-a0eb-b358aa4af8e1

