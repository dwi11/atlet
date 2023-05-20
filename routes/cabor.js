var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var connection = require("../config/db");


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

/* GET home page. */
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

              connection.query(" select * from cabor ;", (err, cabor) => {
                if (err) {
                  return console.log("error: " + err.message);
                }
                res.render("cabor/cabor", {
                  title: "Cabor",
                  cabor :cabor,
                  countAtlet: countAtlet,
                  countAtlet: countAtlet,
                  countPelatih: countPelatih,
                  countCabor: countCabor,
                });
              });
            }
          );
        }
      );
    }
  );
});


router.post("/save", upload.single("fotoCabor"), function (req, res, next) {
  let fotoCabor = null;
  if (req.file) {
    fotoCabor = req.file.path;
  }
  let cabor = {
    nama: req.body.nama,
    sarana: req.body.sarana,
    fotoCabor: fotoCabor,
  };
  let sql = "INSERT INTO cabor SET ?";
  connection.query(sql, cabor, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("success", "Data berhasil disimpan!");
    }
    res.redirect("/cabor");
  });
});


router.post("/edit", upload.single("fotoCabor"), function (req, res, next) {
  let cabor = {
    nama: req.body.nama,
    sarana: req.body.sarana,
  };
  if (req.file) {
    // Pengguna memilih untuk mengganti foto
    let fotoCabor = req.file.path;
    // Hapus foto lama
    let deleteSql =
      "SELECT fotoCabor FROM cabor WHERE id_cabor=" + req.body.id_cabor;
    connection.query(deleteSql, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        const fotoPath = results[0].fotoCabor;
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
    cabor.fotoCabor = fotoCabor;
  }
  let updateSql = "UPDATE cabor SET ? WHERE id_cabor=" + req.body.id_cabor;
  connection.query(updateSql, cabor, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("success", "Data berhasil diperbarui!");
    }
    res.redirect("/cabor");
  });
});


router.post("/delete", function (req, res) {
  let sql = "SELECT fotoCabor FROM cabor WHERE id_cabor=" + req.body.id_cabor;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      // Ambil path foto dari hasil query
      const fotoPath = results[0].fotoCabor;
      // Hapus file foto
      if (fotoPath) {
        fs.unlink(fotoPath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      // Hapus data atlet dari database
      let deleteSql = "DELETE FROM cabor WHERE id_cabor=" + req.body.id_cabor;
      connection.query(deleteSql, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          req.flash("error", "Data berhasil dihapus!");
        }
        res.redirect("/cabor");
      });
    }
  });
});
module.exports = router;
