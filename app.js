require("dotenv").config(); // Untuk memuat variabel lingkungan dari .env
const express = require("express");

const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger"); // Mengimpor spesifikasi swagger dari file swagger.js
const app = express();

const routes = require("./routes"); // Mengimpor routing utama dari folder routes
const errorHandler = require("./middlewares/errorHandler"); // Middleware untuk menangani error

// Middleware untuk logging request
app.use(morgan("dev")); // Menggunakan 'dev' untuk log yang lebih ringkas dan informatif

// Middleware untuk parsing JSON body dan URL encoded
app.use(express.json()); // Parsing untuk application/json
app.use(express.urlencoded({ extended: true })); // Parsing untuk application/x-www-form-urlencoded

// Menyajikan dokumentasi Swagger UI di /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mengonfigurasi routing utama
app.use("/api", routes); // Semua route akan diawali dengan '/api'

// Menambahkan error handler di akhir middleware
app.use(errorHandler);

// Menjalankan server di port yang sudah ditentukan atau default ke port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

