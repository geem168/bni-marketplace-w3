function errorHandler(err, req, res, next) {
  // Log error ke console untuk debugging
  console.error(err);

  // Menentukan status error, default adalah 500 (Internal Server Error)
  const status = err.status || 500;

  // Menentukan pesan error, jika tidak ada pesan di error object, maka 'Internal Server Error' akan digunakan
  const message = err.message || 'Internal Server Error';

  // Mengirimkan response error dengan status dan pesan yang sesuai
  res.status(status).json({
    error: message,
  });
}

module.exports = errorHandler;
