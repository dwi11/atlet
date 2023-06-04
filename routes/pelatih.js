var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var connection = require("../config/db");
var session = require('express-session');

router.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "rahasia",
    name: "secretName",
    cookie: {
      sameSite: true,
      maxAge: 60000,
    },
  })
)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});
// set up multer upload
const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
  // box
  connection.query(
    " SELECT COUNT(*) AS total FROM atlet;",
    (err, countAtlet) => {
      if (err) {
        return console.log("error: " + err.message);
      }
      connection.query(
        " SELECT COUNT(*) AS total FROM pelatih;",
        (err, countPelatih) => {
          if (err) {
            return console.log("error: " + err.message);
          }
          connection.query(
            " SELECT COUNT(*) AS total FROM cabor;",
            (err, countCabor) => {
              if (err) {
                return console.log("error: " + err.message);
              }

              connection.query(" select * from pelatih ;", (err, pelatih) => {
                if (err) {
                  return console.log("error: " + err.message);
                }

              connection.query(" select * from cabor ;", (err, cabor) => {
                if (err) {
                  return console.log("error: " + err.message);
                } if (!req.session.username) {
                  res.redirect('/auth');
                  return;
                }
                res.render("pelatih/pelatih", {
                  title: "Pelatih",
                  pelatih: pelatih,
                  countAtlet: countAtlet,
                  countPelatih: countPelatih,
                  countCabor: countCabor,
                  cabor: cabor,
                });
              });
              });
            }
          );
        }
      );
    }
  );
});

router.post("/save", upload.single("fotoPelatih"), function (req, res, next) {
  let fotoPelatih = null;
  if (req.file) {
    fotoPelatih = req.file.path;
  }
  let pelatih = {
    nik: req.body.nik,
    nama: req.body.nama,
    tempat_lahir: req.body.tempat_lahir,
    tanggal_lahir: req.body.tanggal_lahir,
    tahun_mulai: req.body.tahun_mulai,
    jenis_kelamin: req.body.jenis_kelamin,
    alamat: req.body.alamat,
    cabor: req.body.cabor,
    jenis_pelatih: req.body.jenis_pelatih,
    no_telp: req.body.no_telp,
    fotoPelatih: fotoPelatih,
  };
  console.log(fotoPelatih);
  let sql = "INSERT INTO pelatih SET ?";
  connection.query(sql, pelatih, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("success", "Data berhasil disimpan!");
    } if (!req.session.username) {
      res.redirect('/auth');
      return;
    }
    res.redirect("/pelatih");
  });
});

router.post("/edit", upload.single("fotoPelatih"), function (req, res, next) {
  let pelatih = {
    nik: req.body.nik,
    nama: req.body.nama,
    tempat_lahir: req.body.tempat_lahir,
    tanggal_lahir: req.body.tanggal_lahir,
    tahun_mulai: req.body.tahun_mulai,
    jenis_kelamin: req.body.jenis_kelamin,
    alamat: req.body.alamat,
    cabor: req.body.cabor,
    jenis_pelatih: req.body.jenis_pelatih,
    no_telp: req.body.no_telp,
  };
  if (req.file) {
    // Pengguna memilih untuk mengganti foto
    let fotoPelatih = req.file.path;
    // Hapus foto lama
    let deleteSql =
      "SELECT fotoPelatih FROM pelatih WHERE id_pelatih=" + req.body.id_pelatih;
    connection.query(deleteSql, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        const fotoPath = results[0].fotoPelatih;
        if (fotoPath) {
          fs.unlink(fotoPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }
    });
    pelatih.fotoPelatih = fotoPelatih;
  }
  let updateSql = "UPDATE pelatih SET ? WHERE id_pelatih=" + req.body.id_pelatih;
  connection.query(updateSql, pelatih, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("success", "Data berhasil diperbarui!");
    } if (!req.session.username) {
      res.redirect('/auth');
      return;
    }
    res.redirect("/pelatih");
  });
});

router.post("/delete", function (req, res) {
  let sql = "SELECT fotoPelatih FROM pelatih WHERE id_pelatih=" + req.body.id_pelatih;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      // Ambil path foto dari hasil query
      const fotoPath = results[0].fotoPelatih;
      // Hapus file foto
      if (fotoPath) {
        fs.unlink(fotoPath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      // Hapus data atlet dari database
      let deleteSql = "DELETE FROM pelatih WHERE id_pelatih=" + req.body.id_pelatih;
      connection.query(deleteSql, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          req.flash("error", "Data berhasil dihapus!");
        } if (!req.session.username) {
          res.redirect('/auth');
          return;
        }
        res.redirect("/pelatih");
      });
    }
  });
});

module.exports = router;
