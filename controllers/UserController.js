const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  // Fungsi untuk mendaftarkan user baru
  static async registerUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Validasi input
      if (!email || !password || !name) {
        throw {
          status: 400,
          message: "Name, email, and password are required",
        };
      }

      // Cek apakah email sudah terdaftar
      const exist = await User.findOne({ where: { email } });
      if (exist) {
        throw { status: 409, message: "Email already registered" };
      }

      // Hash password sebelum disimpan
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS)
      );

      // Membuat user baru
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user", // Default role adalah 'user'
      });

      // Mengirimkan response
      res.status(201).json({
        message: "Register successful",
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.log(error, "==> SINI");
      next(error);
    }
  }

  // Fungsi untuk login user dan mengeluarkan token
  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      // Mencari user berdasarkan email
      const user = await User.findOne({ where: { email } });
      if (!user) throw { message: "Invalid email or password" };

      // Membandingkan password yang dimasukkan dengan password yang ada di database
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw { message: "Invalid email or password" };

      // Membuat payload JWT dan mengirimkan token
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ accessToken: token });
    } catch (error) {
      next({ status: 401, message: error.message || "Unauthorized access" });
    }
  }

  // Fungsi untuk mendapatkan semua pengguna (hanya untuk admin)
  static async getAllUsers(req, res) {
    try {
      const dataUsers = await User.findAll({
        raw: true,
        attributes: ["name", "role"], // Mengambil data name dan role saja
      });

      res.status(200).json({ data: dataUsers });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = UserController;
