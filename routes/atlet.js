var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var session = require("express-session");
var connection = require("../config/db");

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

              connection.query(" select * from atlet ;", (err, atlet) => {
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
                res.render("atlet/atlet", {
                  title: "Atlet",
                  atlet: atlet,
                  countAtlet: countAtlet,
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


router.post("/save", upload.single("fotoAtlet"), function (req, res, next) {
  let fotoAtlet = null;
  if (req.file) {
    fotoAtlet = req.file.path;
  }
  let atlet = {
    nik: req.body.nik,
    nama: req.body.nama,
    tempat_lahir: req.body.tempat_lahir,
    tanggal_lahir: req.body.tanggal_lahir,
    tahun_mulai: req.body.tahun_mulai,
    jenis_kelamin: req.body.jenis_kelamin,
    alamat: req.body.alamat,
    cabor: req.body.cabor,
    no_telp: req.body.no_telp,
    ukuran_baju: req.body.ukuran_baju,
    asal_sekolah: req.body.asal_sekolah,
    fotoAtlet: fotoAtlet,
  };
  let sql = "INSERT INTO atlet SET ?";
  connection.query(sql, atlet, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("success", "Data berhasil disimpan!");
    } if (!req.session.username) {
      res.redirect('/auth');
      return;
    }
    res.redirect("/atlet");
  });
});


router.post("/edit", upload.single("fotoAtlet"), function (req, res, next) {
  let atlet = {
    nik: req.body.nik,
    nama: req.body.nama,
    tempat_lahir: req.body.tempat_lahir,
    tanggal_lahir: req.body.tanggal_lahir,
    tahun_mulai: req.body.tahun_mulai,
    jenis_kelamin: req.body.jenis_kelamin,
    alamat: req.body.alamat,
    cabor: req.body.cabor,
    no_telp: req.body.no_telp,
    ukuran_baju: req.body.ukuran_baju,
    asal_sekolah: req.body.asal_sekolah,
  };
  if (req.file) {
    // Pengguna memilih untuk mengganti foto
    let fotoAtlet = req.file.path;
    // Hapus foto lama
    let deleteSql =
      "SELECT fotoAtlet FROM atlet WHERE id_atlet=" + req.body.id_atlet;
    connection.query(deleteSql, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        const fotoPath = results[0].fotoAtlet;
        if (fotoPath) {
          fs.unlink(fotoPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }
    });
    // Update data atlet termasuk foto baru
    atlet.fotoAtlet = fotoAtlet;
  }
  let updateSql = "UPDATE atlet SET ? WHERE id_atlet=" + req.body.id_atlet;
  connection.query(updateSql, atlet, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("success", "Data berhasil diperbarui!");
    } if (!req.session.username) {
      res.redirect('/auth');
      return;
    }
    res.redirect("/atlet");
  });
});


router.post("/delete", function (req, res) {
  let sql = "SELECT fotoAtlet FROM atlet WHERE id_atlet=" + req.body.id_atlet;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      // Ambil path foto dari hasil query
      const fotoPath = results[0].fotoAtlet;
      // Hapus file foto
      if (fotoPath) {
        fs.unlink(fotoPath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      // Hapus data atlet dari database
      let deleteSql = "DELETE FROM atlet WHERE id_atlet=" + req.body.id_atlet;
      connection.query(deleteSql, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          req.flash("error", "Data berhasil dihapus!");
        } if (!req.session.username) {
          res.redirect('/auth');
          return;
        }
        res.redirect("/atlet");
      });
    }
  });
});

module.exports = router;
