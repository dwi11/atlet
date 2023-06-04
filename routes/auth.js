var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var multer = require("multer");
var fs = require("fs");
var connection = require("../config/db");
var { nanoid, customAlphabet } = require("nanoid");
var sendEmail = require("./send");

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});

// set up multer upload
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar"));
    }
  },
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("auth/login", {
    title: "Login",
  });
});

router.get("/regis", function (req, res, next) {
  res.render("auth/regis", {
    title: "Register",
  });
});

router.post("/regis/save", upload.single("fotoProfile"), async function (req, res, next) {
  let fotoProfile = null;
  if (req.file) {
    fotoProfile = req.file.path;
  }

  const id_users = customAlphabet("1234567890abcdef", 10)();
  const saltRounds = 10;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  let users = {
    id_users: id_users,
    nama: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    fotoProfile: fotoProfile,
  };
  const query = `INSERT INTO users (id_users, nama, username, email, password, fotoProfile) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [users.id_users, users.nama, users.username, users.email, users.password, users.fotoProfile];
  connection.query(query, values, function (error, results, fields) {
    if (error) {
      connection.end();
      return next(error);
    }
    res.redirect("/auth"); // Redirect ke halaman autentikasi setelah pendaftaran berhasil
  });
  });

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error saat melakukan query: ' + err.stack);
      res.render('login', { title: 'Login', error: 'Terjadi kesalahan saat login' });
      return;
    }
    if (result.length > 0) {
      const user = result[0];
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          console.error('Error saat memverifikasi password: ' + err.stack);
          res.render('login', { title: 'Login', error: 'Terjadi kesalahan saat login' });
          return;
        }
        if (isMatch) {
          req.session.username = username;
          res.redirect('/')
        } else {
          res.render('auth/login', { title: 'Login', error: 'Password salah' });
        }
      });
    } else {
      res.render('auth/login', { title: 'Login', error: 'Username tidak ditemukan' });
    }
  });
});

module.exports = router;
